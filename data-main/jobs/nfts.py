import logging
from time import sleep
from db import db
from helpers import get_nft_info


ALCHEMY_API_KEY_ETH = "gjaUPQnihxHd-VtQxAYA_k7NQLh83zBg"
ALCHEMY_API_KEY_POLYGON = "CifHqpfxj_kEScDFnfAzxA4cKGvUWN4r"


def main():
    while True:
        try:
            nfts = list(db.nfts.find().sort("updatedAt", 1).limit(1))
            if len(nfts) == 0:
                print("sleeping for 10 minutes")
                sleep(10 * 60)
                continue

            nft = nfts[0]
            info = get_nft_info(
                api_key=ALCHEMY_API_KEY_ETH
                if nft["platform"] == "ETH"
                else ALCHEMY_API_KEY_POLYGON,
                **nft,
            )
            print(f"Updated {info.get('name')}")

        except Exception:
            logging.exception("NFT Job")


if __name__ == "__main__":
    main()
