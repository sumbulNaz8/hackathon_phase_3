import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from config import config

async def test_connection():
    print(f"Testing database connection to: {config.DATABASE_URL[:50]}...")
    
    try:
        # Create the async database engine
        engine = create_async_engine(config.DATABASE_URL.replace('?sslmode=require', ''), 
                                   connect_args={
                                       "server_settings": {
                                           "application_name": "task_management_app",
                                       },
                                   })
        
        # Test the connection
        async with engine.begin() as conn:
            result = await conn.execute(text("SELECT 1"))
            print("Connected successfully!")
            
        # Close the engine
        await engine.dispose()
        
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_connection())