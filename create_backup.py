import shutil
import os

# Define the paths
source_path = r"C:\Users\A`S Computer`s\Desktop\hackathon_2\backend\main.py"
backup_path = r"C:\Users\A`S Computer`s\Desktop\hackathon_2\backend\main.py.bak"

# Create backup
shutil.copy(source_path, backup_path)
print(f"Backup created: {backup_path}")