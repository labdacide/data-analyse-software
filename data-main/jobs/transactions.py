import os
import logging
import requests
from time import sleep
from db import db
from helpers import get_nft_transactions, upsert_profile


api_headers = {
    "accept-type": "application/json",
    "content": "application/json",
    "authorization": f"Basic {os.getenv('AUTHORIZATION')}",
}
api_uri = "https://app.me3x.xyz/api"

ALCHEMY_API_KEY_ETH = "5fv7i5-t_HxBmiUfXJgdTx3VT0r6A4Pu"
ALCHEMY_API_KEY_POLYGON = "coluqh8nBxpRyyr3k4jbbHpr63Q92E2q"


def main():
    all_contracts = requests.get(
        f"{api_uri}/admin/contracts", headers=api_headers
    ).json()

    while True:

        for contract in all_contracts:
            try:
                workspaceId = contract["workspaces"][0]["id"]
                # FIXME: this is to stop fetching new events for Ledger
                if workspaceId == 6:
                    continue

                print(
                    f"Fetching transactions for {contract.get('name', f'workspce {workspaceId}')}"
                )

                # Get last event block
                results = list(
                    db.events.find(
                        {
                            "name": "Transaction",
                            "properties.address": contract["address"],
                        }
                    )
                    .sort("date", -1)  # TODO: verify that `-1` does the job
                    .limit(1)
                )
                last_block = (
                    None if len(results) == 0 else results[0]["properties"]["block"]
                )

                transactions = get_nft_transactions(
                    api_key=ALCHEMY_API_KEY_ETH
                    if contract["platform"] == "ETH"
                    else ALCHEMY_API_KEY_POLYGON,
                    contract=contract["address"],
                    block=last_block,
                    platform=contract["platform"],
                )

                for tx in transactions:
                    tx["workspaceId"] = workspaceId
                    # Storing members to upsert them in the SQL database
                    upsert_profile(
                        address=tx["properties"]["to"],
                        platform=contract["platform"],
                        workspaceId=workspaceId,
                    )
                    if not "0x00000000" in tx["from"]:
                        upsert_profile(
                            address=tx["from"],
                            platform=contract["platform"],
                            workspaceId=workspaceId,
                        )
                    db.events.update_one(
                        {"eventId": tx["eventId"]}, {"$setOnInsert": tx}, upsert=True
                    )

                print(f"Saved {len(transactions)} transactions")

            except Exception as e:
                logging.exception("Transactions Job")

        sleep(10 * 60)  # Space each execution by 10 minutes


if __name__ == "__main__":
    main()
