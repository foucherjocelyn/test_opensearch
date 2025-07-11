from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os

from app.routers import logs

app = FastAPI()

FRONT_HOST = os.getenv("FRONT_HOST")
FRONT_PORT = os.getenv("FRONT_PORT")

app.include_router(logs.router)


# Configure CORS
if FRONT_HOST and FRONT_PORT:
    origins = [f"{FRONT_HOST}:{FRONT_PORT}"]
else:
    origins = ["*"]  # fallback for dev or missing env

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
