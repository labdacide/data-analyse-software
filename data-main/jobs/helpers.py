import json
import requests
from pprint import pprint
from datetime import datetime
from pprint import pprint
from typing import List, Optional
from db import db
from pycoingecko import CoinGeckoAPI
from dotenv import load_dotenv

load_dotenv()

HEADERS = {"accept": "application/json", "content-type": "application/json"}

coingecko = CoinGeckoAPI()


def get_asset_transfers(
    api_key: str,
    category: List[str],
    sender: Optional[str] = None,
    receiver: Optional[str] = None,
    block: Optional[str] = None,
    contract: Optional[str] = None,
    order: str = "asc",
    limit: int = 100,
    platform="ETH",
) -> List[dict]:
    payload = {
        "id": 1,
        "jsonrpc": "2.0",
        "method": "alchemy_getAssetTransfers",
        "params": [
            {
                "category": category,
                "withMetadata": True,
                "order": order,
                "maxCount": hex(limit),
            }
        ],
    }
    if block:
        payload["params"][0]["fromBlock"] = block
        payload["params"][0]["toBlock"] = block
    if contract:
        payload["params"][0]["contractAddresses"] = [contract]
    if sender:
        payload["params"][0]["fromAddress"] = sender
    if receiver:
        payload["params"][0]["toAddress"] = receiver

    api_uri = f"https://{platform.lower()}-mainnet.g.alchemy.com"
    data = requests.post(
        f"{api_uri}/v2/{api_key}", json=payload, headers=HEADERS
    ).json()

    if not data.get("result"):
        pprint(data)
        return []

    return data["result"]["transfers"]


def get_floorprice(api_key: str, contract: str, platform: str = "ETH"):
    # Step 1: get last 5 transactions
    last_transactions = get_asset_transfers(
        api_key=api_key,
        category=["erc721", "erc1155"],
        contract=contract,
        order="desc",
        limit=5,
        platform=platform,
    )

    # Step 2: get corresponding sale transactions
    prices = []
    for tx in last_transactions:
        sale_transactions = get_asset_transfers(
            api_key=api_key,
            block=tx["blockNum"],
            category=["erc20", "external"],
            sender=tx["to"],
            receiver=tx["from"],
            platform=platform,
        )
        if len(sale_transactions) == 0:
            continue

        price = sale_transactions[0]["value"]
        if not price:
            price = 0
        prices.append(
            {
                "price": price,
                "currency": sale_transactions[0]["asset"],
            }
        )
    if len(prices) == 0:
        return None
    return (
        sum([p["price"] for p in prices]),
        prices[0]["currency"],
    )


def get_nft_transactions(
    api_key: str,
    contract: str,
    block: Optional[str] = None,
    pageKey: Optional[str] = None,
    limit: int = 1_000,
    order: str = "asc",
    platform: str = "ETH",
):
    transactions = []
    payload = {
        "id": 1,
        "jsonrpc": "2.0",
        "method": "alchemy_getAssetTransfers",
        "params": [
            {
                "contractAddresses": [contract],
                "category": ["erc721", "erc1155"],
                "order": order,
                "maxCount": hex(limit),
                "withMetadata": True,
            }
        ],
    }
    if block:
        payload["params"][0]["fromBlock"] = block
    if pageKey:
        payload["params"][0]["pageKey"] = pageKey

    api_uri = f"https://{platform.lower()}-mainnet.g.alchemy.com"
    data = requests.post(
        f"{api_uri}/v2/{api_key}", json=payload, headers=HEADERS
    ).json()

    for tx in data["result"]["transfers"]:
        # Get the transaction sale data
        sale_transaction = get_asset_transfers(
            api_key=api_key,
            category=["erc20", "external"],
            sender=tx["to"],
            receiver=tx["from"],
            block=tx["blockNum"],
            platform=platform,
        )

        currency = None
        price = 0
        royalties = 0
        marketplace_fee = 0

        # FIXME: sometimes the sender pays the fees but sometimes the receiver does -> handle all cases
        # if len(sale_transaction) == 3:
        #     sale_transaction.sort(key=lambda t: t['value'])
        #     currency = sale_transaction[0]['asset']
        #     marketplace_fee = sale_transaction[0]['value']
        #     royalties = sale_transaction[1]['value']
        #     price = sale_transaction[2]['value']

        if len(sale_transaction) == 1:
            currency = sale_transaction[0]["asset"]
            price = sale_transaction[0]["value"]

        if len(sale_transaction) > 1:
            pprint(sale_transaction)

        if tx["category"] == "erc1155":
            tokenId = tx["erc1155Metadata"][0]["value"]
        else:
            tokenId = tx.get("tokenId")

        transactions.append(
            {
                "eventId": tx["hash"],
                "name": "Transaction",
                "date": tx["metadata"]["blockTimestamp"],
                "from": tx["from"],
                "properties": {
                    "platform": platform,
                    "block": tx["blockNum"],
                    "hash": tx["hash"],
                    "address": contract,
                    "to": tx["to"],
                    "symbol": tx.get("asset"),
                    "tokenId": tokenId,
                    "currency": currency,
                    "marketplaceFee": marketplace_fee,
                    "royalties": royalties,
                    "price": price,
                },
            }
        )

    return transactions


def get_media(nft: dict):
    if nft.get("opensea") and nft["opensea"].get("imageUrl"):
        return nft["opensea"]["imageUrl"]
    if nft.get("media"):
        if nft["media"][0].get("thumbnail"):
            return nft["media"][0]["thumbnail"]
        if nft["media"][0].get("gateway"):
            return nft["media"][0]["gateway"]
    return None


def get_wallet_collection(api_key: str, address: str, platform: str = "ETH"):
    api_uri = f"https://{platform.lower()}-mainnet.g.alchemy.com"
    response = requests.get(
        f"{api_uri}/nft/v2/{api_key}/getContractsForOwner?owner={address}",
        headers=HEADERS,
    ).json()

    collection = []
    for nft in response["contracts"]:
        data = get_nft_info(api_key=api_key, **nft, platform=platform)
        data["tokenId"] = nft.get("tokenId")
        data["balance"] = nft.get("totalBalance", 1)
        if data["balance"] > 1_000_000:
            continue
        collection.append(data)

    return collection


def get_nft_info(api_key: str, address: str, **info):
    """
    Updates, stores and returns NFT data from address
    """
    data = db.nfts.find_one({"address": address, "platform": info["platform"]})

    if not data or (datetime.now() - data.get("updatedAt")).days > 7:
        floorprice = 0
        currency = None
        if (
            info.get("opensea")
            and info["opensea"].get("floorPrice")
            and info["opensea"]["floorPrice"] < 5
        ):
            floorprice = info["opensea"]["floorPrice"]
            currency = "ETH"
        else:
            estimated_floorprice = get_floorprice(
                api_key=api_key, contract=address, platform=info["platform"]
            )
            if estimated_floorprice != None:
                floorprice, currency = estimated_floorprice

        insert_data = {
            "address": address,
            "platform": info["platform"],
            "name": info.get("name"),
            "symbol": info.get("symbol"),
            "category": info.get("tokenType"),
            "spam": info.get("isSpam"),
            "thumbnail": get_media(info),
        }
        update_data = {
            "floorprice": floorprice,
            "currency": currency,
            "updatedAt": datetime.now(),
        }

        db.nfts.update_one(
            {"address": address, "platform": info["platform"]},
            update={
                "$setOnInsert": insert_data,
                "$set": update_data,
            },
            upsert=True,
        )
        data = {**insert_data, **update_data}

    return data


def get_wallet_balance(api_key: str, address: str, platform: str = "ETH"):
    """
    Returns the balance value in ETH or MATIC
    """
    if platform not in ["ETH", "POLYGON"]:
        return None

    api_uri = f"https://{platform.lower()}-mainnet.g.alchemy.com"
    response = requests.post(
        f"{api_uri}/v2/{api_key}",
        json={
            "id": 1,
            "jsonrpc": "2.0",
            "method": "eth_getBalance",
            "params": [address, "latest"],
        },
        headers=HEADERS,
    ).json()

    hex_value = response["result"]  # hex value in wei (10e18)
    value = int(hex_value, base=16) * 1e-18
    currency = "ETH" if platform == "ETH" else "MATIC"
    return {
        "value": value,
        "currency": currency,
        "usd": value * convert_token_to_usd(currency),
    }


def upsert_profile(address: str, platform: str, workspaceId: int):
    profile = {"address": address, "platform": platform, "workspaceId": workspaceId}
    return db.profiles.update_one(
        filter=profile, update={"$setOnInsert": profile}, upsert=True
    )


def get_collection_networth(assets: List[dict], platform="ETH"):
    """
    Returns wallet NFT networth in USD
    """
    # FIXME: handle difference currencies -> convert everything to USD at the end / only consider NFTs in base currency
    currency = "ETH" if platform == "ETH" else "MATIC"
    usd_price = convert_token_to_usd(currency)
    if usd_price == None:
        print("Error in get_collection_networth: currency ", currency)
        return None
    networth = 0

    for asset in assets:
        if (
            asset.get("floorprice") and asset.get("currency") == currency
        ):  # TODO: handle other tokens as well
            worth = asset["balance"] * asset["floorprice"]

            if worth > 10_000 and asset["balance"] > 1_000:
                pprint(asset)
                continue

            networth += worth

    return {"currency": currency, "value": networth, "usd": networth * usd_price}


cached_conversions = {}


def convert_token_to_usd(token_symbol: str):
    if (
        token_symbol in cached_conversions
        and (cached_conversions[token_symbol]["timestamp"] - datetime.now()).days < 1
    ):
        return cached_conversions[token_symbol]["usd"]

    results = coingecko.search(query=token_symbol)["coins"]
    if len(results) > 0:
        coin = results[0]
        if coin["symbol"].lower() == token_symbol.lower():
            usd_price = coingecko.get_price(ids=coin["id"], vs_currencies="usd")[
                coin["id"]
            ]["usd"]
            cached_conversions[token_symbol] = {
                "usd": usd_price,
                "timestamp": datetime.now(),
            }
            return usd_price

    print(f"{token_symbol} not available in Coingecko")
    return None


if __name__ == "__main__":
    p = db.profiles.find_one(
        filter={"address": "0x7E3E8E243BD07918F996F7c42AA0B14Fb7dFE0C5"},
        projection={
            "_id": False,
            "collection.updatedAt": False,
            "collection._id": False,
        },
    )
    if p == None:
        print("nothing to show here")
        exit(0)

    with open("collection.json", "w") as f:
        json.dump(p["collection"], f, sort_keys=True, indent=4, default=str)
