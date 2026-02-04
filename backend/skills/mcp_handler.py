"""Mock MCP handler for the backend application."""

async def initialize_mcp():
    """Mock initialization of MCP client."""
    print("MCP client initialized (mock)")
    pass

async def get_mcp_client():
    """Mock function to get MCP client."""
    # Return a mock client object
    class MockMCPClient:
        def __init__(self):
            self.client_sessions = {}
            
        async def list_resources(self, server: str):
            return []
            
        async def read_resource(self, server: str, uri: str):
            return ""
    
    return MockMCPClient()