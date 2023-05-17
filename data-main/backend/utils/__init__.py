import json
import base64

def save_json(data:dict, filepath:str):
    with open(filepath, 'w') as f:
        json.dump(data, f)
    return

def try_get(f, fallback=None):
    value = fallback
    try:
        value = f()
    except Exception as e: pass
    return value

def generate_id(*args):
    string = ':'.join(args).encode('ascii')
    return base64.b64encode(string).decode('ascii')
