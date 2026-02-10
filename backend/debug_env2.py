import os
import sys
from dotenv import load_dotenv

print("Before loading .env:")
print("DATABASE_URL:", repr(os.environ.get("DATABASE_URL")))

print("\nLoading .env file...")
result = load_dotenv()

print("\nAfter loading .env:")
print("Load result:", result)
print("DATABASE_URL:", repr(os.environ.get("DATABASE_URL")))

print("\nChecking .env file contents:")
with open('.env', 'r') as f:
    for i, line in enumerate(f, 1):
        if 'DATABASE_URL' in line:
            print(f"Line {i}: {line.strip()}")