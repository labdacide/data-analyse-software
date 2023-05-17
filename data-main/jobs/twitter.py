import os
import logging
import base64
import requests
import tweepy
from time import sleep
from datetime import datetime
from db import db

from dotenv import load_dotenv

load_dotenv()


def generate_id(*args):
    string = ":".join(args).encode("ascii")
    return base64.b64encode(string).decode("ascii")


api_headers = {
    "accept-type": "application/json",
    "content": "application/json",
    "authorization": f"Basic {os.getenv('AUTHORIZATION')}",
}
api_uri = "https://app.me3x.xyz/api"

twitter_api_key = os.getenv("TWITTER_API_KEY")
twitter_api_secret = os.getenv("TWITTER_API_SECRET")
access_token = os.getenv("TWITTER_ACCESS_TOKEN")
access_token_secret = os.getenv("TWITTER_ACCESS_TOKEN_SECRET")

# authentication
auth = tweepy.OAuthHandler(twitter_api_key, twitter_api_secret)
auth.set_access_token(access_token, access_token_secret)

api = tweepy.API(auth)
client = tweepy.Client(bearer_token=os.getenv("TWITTER_BEARER_TOKEN"))


def get_twitter_profile(**kwargs):
    return api.get_user(**kwargs)


def get_twitter_events(screen_name: str):
    tweets = api.user_timeline(
        screen_name=screen_name, count=20, include_rts=False, tweet_mode="extended"
    )
    events = []

    for tweet in tweets:
        created_at: datetime = tweet.created_at
        if (datetime.now().timestamp() - created_at.timestamp()) / (
            1000 * 60 * 60 * 24
        ) > 7:
            continue

        likes = client.get_liking_users(
            id=tweet.id
        )  # list of users with id and name and username (aka screen_name aka handle)
        retweets = client.get_retweeters(id=tweet.id)

        if likes.data:
            for user in likes.data:
                event_id = generate_id(str(tweet.id), str(user.id), "like")
                events.append(
                    {
                        "eventId": event_id,
                        "name": "Twitter Like",
                        "date": str(datetime.now()),
                        "from": user.id,
                        "properties": {
                            "author": screen_name,
                            "from": user.id,
                            "name": user.name,
                            "username": user.username,
                            "tweetCreatedAt": str(created_at),
                            "tweetId": tweet.id,
                        },
                    }
                )

        if retweets.data:
            for user in retweets.data:
                event_id = generate_id(str(tweet.id), str(user.id), "retweet")
                events.append(
                    {
                        "eventId": event_id,
                        "name": "Twitter Retweet",
                        "date": str(datetime.now()),
                        "from": user.id,
                        "properties": {
                            "author": screen_name,
                            "from": user.id,
                            "name": user.name,
                            "username": user.username,
                            "tweetCreatedAt": str(created_at),
                            "tweetId": tweet.id,
                        },
                    }
                )

    return events


def main():
    all_workspaces = requests.get(
        f"{api_uri}/admin/workspaces", headers=api_headers
    ).json()

    while True:

        for workspace in all_workspaces:
            screen_name = workspace.get(
                "twitterUsername"
            )  # FIXME: switch to using twitterId as it is more reliable
            if not screen_name:
                continue

            try:
                print(f"Fetching Twitter events for {workspace['name']} ({screen_name})")

                events = get_twitter_events(screen_name=screen_name)
                events = list(
                    map(lambda e: {**e, "workspaceId": workspace["id"]}, events)
                )  # add workspaceId to the events

                for event in events:
                    db.events.update_one(
                        filter={"eventId": event["eventId"]},
                        update={"$setOnInsert": event},
                        upsert=True,
                    )

                print(f"Saved {len(events)} Twitter events for {workspace['name']}")

            except Exception:
                logging.exception("Twitter Job")

        sleep(10 * 60)  # Space each call by 10 minutes


if __name__ == "__main__":
    main()
