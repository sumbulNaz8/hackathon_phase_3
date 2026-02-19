import sys
from pathlib import Path

# Add the project root directory to the Python path
project_root = Path(__file__).resolve().parent
sys.path.insert(0, str(project_root))

from complete_server import get_password_hash, verify_password

# Test the password hashing functionality
test_password = "password123"
hashed = get_password_hash(test_password)
print(f"Original password: {test_password}")
print(f"Hashed password: {hashed}")

# Test verification
verification_result = verify_password(test_password, hashed)
print(f"Verification result: {verification_result}")

# Test with wrong password
wrong_verification = verify_password("wrongpassword", hashed)
print(f"Wrong password verification: {wrong_verification}")