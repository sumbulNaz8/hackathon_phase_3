from config import config

print("Current DATABASE_URL:", repr(config.DATABASE_URL))
print("Does it contain 'postgresql'?", 'postgresql' in config.DATABASE_URL.lower())
print("Does it contain 'sqlite'?", 'sqlite' in config.DATABASE_URL.lower())