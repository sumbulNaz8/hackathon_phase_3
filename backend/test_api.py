import requests
import json

try:
    response = requests.get('http://127.0.0.1:8000/openapi.json')
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    if response.headers:
        print("Headers:")
        for key, value in response.headers.items():
            print(f"  {key}: {value}")
except Exception as e:
    print(f"Error: {e}")