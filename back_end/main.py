
from fastapi import FastAPI

app = FastAPI(title="Wegrow ConnectX API")

@app.get("/")
def home():
    return {"message": "Wegrow ConnectX backend is running"}

@app.get("/health")
def health():
    return {"status": "success"}
