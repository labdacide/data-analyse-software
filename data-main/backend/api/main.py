import os
import requests
import tweepy
import pandas as pd
from pprint import pprint
from functools import reduce
from typing import Union, Any
from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel
from bson import ObjectId
from utils.db import db
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()


def is_same_day(date1, date2):
    return date1[:10] == date2[:10]


def get_all_ids(member):
    ids = [member["address"]]
    if member.get("twitterId"):
        ids.append(member["twitterId"])
    if member.get("discordId"):
        ids.append(member["discordId"])
    return ids


class GetMembersInput(BaseModel):
    conditions: Any
    sort: Any


@app.get("/member/{id}")
def get_member_profile(id: str, platform: str):
    member = db.profile.find_one({"address": id, "platform": platform})
    return member


@app.post("/members")
def get_members(body: GetMembersInput, page: Union[int, None] = None):
    if not page:
        page = 0

    field_sort = (
        (body.sort["field"], body.sort["order"]) if body.sort else ("updatedAt", -1)
    )

    profiles = list(
        db.profiles.find(
            body.conditions,
            projection={"_id": False, "collection": False, "holds._id": False},
        )
        .limit(15)
        .skip(page * 15)
        .sort(*field_sort)
    )

    return profiles


@app.get("/members/{workspace_id}/leaderboard")
def get_member_leaderboard(workspace_id: int):
    return {
        "networth": list(
            db.profiles.find(
                {"workspaceId": workspace_id},
                projection={"_id": False, "collection._id": False, "holds": False},
            )
            .sort("netWorth.usd", -1)
            .limit(1)
        )[0],
        "balance": list(
            db.profiles.find(
                {"workspaceId": workspace_id},
                projection={"_id": False, "collection": False, "holds": False},
            )
            .sort("balance.usd", -1)
            .limit(1)
        )[0],
        "influencer": list(
            db.profiles.find(
                {"workspaceId": workspace_id},
                projection={"_id": False, "collection": False, "holds": False},
            )
            .sort("twitter.followers", -1)
            .limit(1)
        )[0],
    }


def update_profile_owned_nfts(profile):
    response = requests.get(
        f"{os.getenv('API_URI')}/admin/contracts",
        headers={
            "accept-type": "application/json",
            "content": "application/json",
            "authorization": f"Basic {os.getenv('AUTHORIZATION')}",
        },
    ).json()

    contracts = list(
        filter(lambda c: c["workspaces"][0]["id"] == profile["workspaceId"], response)
    )
    contracts = list(map(lambda c: c["address"].lower(), contracts))

    owned_nfts = list(
        filter(lambda nft: nft["address"].lower() in contracts, profile["collection"])
    )

    db.profiles.update_one(
        filter={"_id": ObjectId(profile["_id"])}, update={"$set": {"holds": owned_nfts}}
    )
    return


@app.get("/members/{address}/collection")
def get_member_collection(address: str, background_tasks: BackgroundTasks):
    profile = db.profiles.find_one(
        {"address": address}, projection={"collection._id": False}
    )
    if profile == None:
        return []

    background_tasks.add_task(update_profile_owned_nfts, profile)

    return profile["collection"]


class HistoryInput(BaseModel):
    filter: Any


@app.post("/history/transactions/{contract}")
def get_contract_history(contract: str, body: HistoryInput):
    if body.filter:
        members = db.profiles.find(
            filter={
                "$and": [{c["name"]: {c["operator"]: c["value"]}} for c in body.filter]
            }
        )
        valid_ids = list(reduce(lambda ids, m: ids + get_all_ids(m), list(members), []))
        # Filter events where the from doesn't belong to the list of members
        events = list(
            db.events.find(
                {
                    "name": "Transaction",
                    "properties.address": contract,
                    "from": {"$in": valid_ids},
                }
            )
        )
    else:
        events = list(
            db.events.find({"name": "Transaction", "properties.address": contract})
        )
    if len(events) == 0:
        return

    # Flatten the events
    events = list(map(lambda e: {**e, **e["properties"]}, events))

    df = pd.DataFrame(events).drop(columns=["properties"])
    if "price" not in df.columns:
        df["price"] = 0
    if "royalties" not in df.columns:
        df["royalties"] = 0

    df["price"].fillna(value=0, inplace=True)
    df["royalties"].fillna(value=0, inplace=True)

    df["date"] = pd.to_datetime(df["date"])

    # Getting the min/mean/sum of numerical values per day
    grouped_df = df.groupby(
        df["date"].dt.floor(freq="d").dt.strftime(date_format="%Y-%m-%d"),
        group_keys=False,
    )
    transaction_count = grouped_df.size().reset_index(name=contract).to_dict("records")
    transaction_volume = (
        grouped_df["price"].sum().reset_index(name=contract).to_dict("records")
    )
    floor_price = (
        grouped_df["price"].min().reset_index(name=contract).to_dict("records")
    )
    revenue = (
        grouped_df["royalties"].sum().reset_index(name=contract).to_dict("records")
    )
    holders = grouped_df["to"].nunique().reset_index(name=contract).to_dict("records")

    def get_growth(values):
        # FIXME: looking at all values not the last 28 days
        if len(values) == 1:
            return 0
        avg = sum([v[contract] for v in values[:-1]]) / len(values[:-1])
        return round((values[-1][contract] - avg) * 100 / avg)

    return {
        "contract": contract,
        "overview": [
            {
                "name": "Holders",
                "value": sum([h[contract] for h in holders]),
                "growth": get_growth(holders),
            },
            {
                "name": "Transactions",
                "value": sum([tx[contract] for tx in transaction_count]),
                "growth": get_growth(transaction_count),
            },
        ],
        "history": [
            {
                "name": "New Holders",
                "description": "New holders of your token.",
                "views": ["count"],
                "count": holders,
            },
            {
                "name": "Transactions",
                "description": "Transactions of your token.",
                "views": ["count", "volume"],
                "count": transaction_count,
                "volume": transaction_volume,
            },
            {
                "name": "Revenue",
                "description": "Creator earnings perceived on secondary transactions.",
                "views": ["value"],
                "value": revenue,
            },
            {
                "name": "Floor Price",
                "description": "Lowest value of your token on all the transactions for that day.",
                "views": ["value"],
                "value": floor_price,
            },
        ],
    }


@app.post("/history/twitter/{screen_name}")
def get_twitter_history(screen_name: str, body: HistoryInput):
    if body.filter:
        members = db.profiles.find(
            filter={
                "$and": [{c["name"]: {c["operator"]: c["value"]}} for c in body.filter]
            }
        )
        valid_ids = list(reduce(lambda ids, m: ids + get_all_ids(m), list(members), []))
        # Filter events where the from doesn't belong to the list of members
        events = list(
            db.events.find(
                filter={
                    "$or": [{"name": "Twitter Like"}, {"name": "Twitter Retweet"}],
                    "properties.author": screen_name,
                    "from": {"$in": valid_ids},
                },
                projection={"_id": False},
            )
        )
    else:
        events = list(
            db.events.find(
                filter={
                    "$or": [{"name": "Twitter Like"}, {"name": "Twitter Retweet"}],
                    "properties.author": screen_name,
                },
                projection={"_id": False},
            )
        )
    if len(events) == 0:
        return

    events = list(map(lambda e: {"title": e["name"], **e, **e["properties"]}, events))
    df = pd.DataFrame(events).drop(columns=["properties"])
    df["action"] = df["title"].apply(
        lambda r: "like" if r == "Twitter Like" else "retweet"
    )
    df["date"] = pd.to_datetime(df["date"], utc=True)
    df["label"] = df["tweetId"].apply(
        lambda id: f"https://twitter.com/i/web/status/{id}"
    )
    tweets = (
        df[["label", "tweetCreatedAt"]]
        .rename(columns={"tweetCreatedAt": "date"})
        .drop_duplicates()
        .to_dict("records")
    )

    all_df = df.groupby(
        df["date"].dt.floor("d").dt.strftime("%Y-%m-%d"), group_keys=False
    )
    like_df = df[df["action"] == "like"].groupby(
        df["date"].dt.floor("d").dt.strftime("%Y-%m-%d"), group_keys=False
    )
    retweet_df = df[df["action"] == "retweet"].groupby(
        df["date"].dt.floor("d").dt.strftime("%Y-%m-%d"), group_keys=False
    )
    all = all_df.size().reset_index(name="value").to_dict("records")
    likes = like_df.size().reset_index(name="value").to_dict("records")
    retweets = retweet_df.size().reset_index(name="value").to_dict("records")

    return {
        "name": "Twitter Engagement",
        "description": "Likes and retweets of your tweets.",
        "views": ["likes", "retweets", "all"],
        "likes": likes,
        "retweets": retweets,
        "all": all,
        "tweets": list(tweets),
    }


class GetCampaignInput(BaseModel):
    conditions: Any
    start: str
    filter: Any


@app.post("/campaign")
def get_campaign(body: GetCampaignInput):
    events = db.events.find(body.conditions)
    steps = [
        {"name": "Joined Discord", "members": {}},
        {"name": "Airdrop", "members": {}},
        {"name": "Sell", "members": {}},
    ]
    f: dict[str, Any] = {"discordJoinedAt": {"$gt": body.start}}
    if body.filter:
        f["$and"] = [{c["name"]: {c["operator"]: c["value"]}} for c in body.filter]
    members = db.profiles.find(filter=f, projection={"_id": False, "updatedAt": False})
    steps[0]["members"] = {m["address"].lower(): {**m} for m in members}

    for event in list(events):
        event["to"] = event["properties"]["to"]
        if (
            event["to"] in steps[0]["members"]
            and not event["to"] in steps[1]["members"]
        ):
            member = steps[0]["members"][event["to"]]
            steps[1]["members"][event["to"]] = {
                **member,
                "date": event["date"],
            }
        if (
            event["from"] in steps[1]["members"]
            and not event["from"] in steps[2]["members"]
        ):
            member = steps[1]["members"][event["from"]]
            steps[2]["members"][event["from"]] = {
                **member,
                "date": event["date"],
            }
    return list(
        map(
            lambda step: {
                "name": step["name"],
                "value": len(step["members"]),
                "members": list(step["members"].values())[:20],
            },
            steps,
        )
    )


@app.get("/{workspace_id}/collections")
def get_collection_names(workspace_id: int):
    profiles = db.profiles.find(filter={"workspaceId": workspace_id}, limit=100)
    collection_names = []
    for profile in list(profiles):
        for asset in profile["collection"]:
            if asset["name"]:
                collection_names.append(asset["name"])
    return list(set(collection_names))


class GetOverlapInput(BaseModel):
    filter: Any


@app.post("/overlap")
def get_overlap_communities(body: GetOverlapInput):
    """
    Returns the list of overlapping communities alongside with the number of holders for the given project.
    """
    profiles = list(
        db.profiles.find(
            filter={
                "$and": [{c["name"]: {c["operator"]: c["value"]}} for c in body.filter]
            }
        )
    )
    if len(profiles) == 0:
        return None

    overlap_communities = {}
    for profile in profiles:
        if not profile.get("collection"):
            continue
        for nft in profile["collection"]:
            if nft["name"] is None:
                continue
            if nft["name"] in overlap_communities:
                overlap_communities[nft["name"]] += 1
            else:
                overlap_communities[nft["name"]] = 1

    result = [{"name": k, "count": v} for (k, v) in overlap_communities.items()]
    result.sort(key=lambda nft: nft["count"], reverse=True)
    max_count = max(result, key=lambda el: el["count"])["count"]
    return {"communities": result[:100], "max": max_count}


twitter_api_key = os.getenv("TWITTER_API_KEY")
twitter_api_secret = os.getenv("TWITTER_API_SECRET")
access_token = os.getenv("TWITTER_ACCESS_TOKEN")
access_token_secret = os.getenv("TWITTER_ACCESS_TOKEN_SECRET")
# authentication
auth = tweepy.OAuthHandler(twitter_api_key, twitter_api_secret)
auth.set_access_token(access_token, access_token_secret)
api = tweepy.API(auth)
client = tweepy.Client(bearer_token=os.getenv("TWITTER_BEARER_TOKEN"))


def update_twitter_profile(profile):
    db.profiles.update_one(
        filter={"twitter.screen_name": profile["screen_name"]},
        update={
            "$set": {
                "name": profile["name"],
                "followings": profile["friends_count"],
                "followers": profile["followers_count"],
                "description": profile["description"],
            }
        },
    )
    return


@app.get("/twitter/profile/{screen_name}")
def get_twitter_profile(screen_name: str, background_tasks: BackgroundTasks):
    profile = api.get_user(screen_name=screen_name)
    background_tasks.add_task(update_twitter_profile, profile._json)
    return profile._json
