import json
import requests
from tqdm.auto import tqdm
from utils import save_json, try_get

contract_dogami = "KT1NVvPsNDChrLRH5K2cy6Sc9r1uuUwdiZQd"
contract_gap = "KT1CAbPGHUWvkSA9bxMPkqSgabgsjtmRYEda"


def get_token_transactions(address:str, block:int=0):
    print(block)
    if block == None:
        block = 0

    transactions = []
    response = requests.get(f"https://api.tzkt.io/v1/tokens/transfers?token.contract={address}&offset={block}&limit=1000").json()
    for tx in tqdm(response):
        transactions.append({
            'name': 'Transaction',
            'date': tx['timestamp'],
            'from': try_get(lambda: tx['from']['address'], '0x000000'),
            'to': tx['to']['address'],
            'address': address,
            'symbol': try_get(lambda: tx['token']['contract']['alias'], ''),
            'platform': 'TEZOS',
            'tokenId': int(tx['token']['tokenId']),
            'block': tx['level'],
            'quantity': int(tx['amount']),
            'royalties': try_get(lambda: list(json.loads(tx['token']['metadata']['royalties'])['shares'].values())[0]/10e2, 0)
        })
        
    if len(response) == 1_000: return transactions + get_token_transactions(address, block=block+1_000)
    return transactions


def get_owner_nfts(address:str):
    collection = []
    response = requests.get(
        f"https://api.tzkt.io/v1/tokens/balances?account={address}&balance.ne=0&token.standard=fa2&limit=10000").json()
    
    for nft in response:
        collection.append({
            'address': nft['token']['contract']['address'],
            'platform': 'TEZOS',
            'balance': 1,
            'tokenId': int(nft['token']['tokenId']),
            'symbol': try_get(lambda: nft['token']['metadata']['symbol'], ''),
            'name': try_get(lambda: nft['token']['metadata']['name'], ''),
            'thumbnail': try_get(lambda: nft['token']['metadata']['thumbnailUri'], ''),
            'floorprice': 0,
            'category': nft['token']['standard'],
        })
    return collection

if __name__ == '__main__':
    save_json(get_token_transactions(contract_dogami)[:20], './dogami.json')
    save_json(get_owner_nfts("tz1Ze9U6rH5PbdKtvLKUPNLiqATBzBNnpQ2d"), './dogami_wallet.json')
