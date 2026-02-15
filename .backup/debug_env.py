import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

print("Environment variables after loading:")
print("- DATABASE_URL:", repr(os.getenv("DATABASE_URL")))
print("- All environment variables containing 'DATABASE':")
for key, value in os.environ.items():
    if 'DATABASE' in key.upper():
        print(f"  {key}: {repr(value)}")

print("\nContents of .env file:")
with open('.env', 'r') as f:
    print(f.read())