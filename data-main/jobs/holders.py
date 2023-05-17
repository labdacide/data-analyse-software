import logging
from pprint import pprint
from datetime import datetime
from bson.objectid import ObjectId
from db import db
from helpers import get_wallet_balance, get_wallet_collection, get_collection_networth


ALCHEMY_API_KEY_ETH = "rbHLmNLQJ30t6YnxB1KW_gShqnDmkupV"
ALCHEMY_API_KEY_POLYGON = "CifHqpfxj_kEScDFnfAzxA4cKGvUWN4r"


def main():
    """
    Update member on-chain profiles one by one starting with the oldest updated profile.
    """

    while True:

        member = (
            db.profiles.find(
                filter={
                    "address": {"$exists": True},
                    "workspaceId": 5,
                    # "workspaceId": {"$ne": 6},
                }
            )
            .sort([("updatedAt", 1), ("netWorth", -1)])
            .limit(1)
        )[0]

        try:
            api_key = (
                ALCHEMY_API_KEY_ETH
                if member["platform"] == "ETH"
                else ALCHEMY_API_KEY_POLYGON
            )
            collection = get_wallet_collection(
                api_key=api_key,
                address=member["address"],
                platform=member["platform"],
            )
            networth = get_collection_networth(collection, platform=member["platform"])
            balance = get_wallet_balance(
                api_key=api_key, address=member["address"], platform=member["platform"]
            )

            db.profiles.update_one(
                filter={"_id": ObjectId(member["_id"])},
                update={
                    "$set": {
                        "collection": collection,
                        "netWorth": networth,
                        "balance": balance,
                        "updatedAt": datetime.now(),
                    }
                },
            )
            print(f"Updated profile {member['address']}")

        except Exception:
            logging.exception("Holders Job")


if __name__ == "__main__":
    main()
