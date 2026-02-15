from fastapi import FastAPI
import uvicorn

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello from AI Productivity Engine!"}

@app.get("/test")
def test_endpoint():
    return {"status": "working"}

if __name__ == "__main__":
    # Try running on a different port
    uvicorn.run(app, host="0.0.0.0", port=8080, log_level="info")