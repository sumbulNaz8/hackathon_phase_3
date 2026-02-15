import asyncio
import asyncpg

async def test_connection():
    # Connection parameters extracted from the URL
    host = "ep-aged-meadow-a7czyut5-pooler.ap-southeast-2.aws.neon.tech"
    port = 5432
    user = "neondb_owner"
    password = "npg_DXTBdq71QFIw"
    database = "neondb"
    
    try:
        # Connect to the database
        conn = await asyncpg.connect(
            host=host,
            port=port,
            user=user,
            password=password,
            database=database,
            ssl='require'
        )
        
        # Execute a simple query
        result = await conn.fetchval('SELECT 1')
        print(f"Connected successfully! Result: {result}")
        
        # Close the connection
        await conn.close()
        
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_connection())