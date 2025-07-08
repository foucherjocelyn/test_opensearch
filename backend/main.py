from fastapi import FastAPI, HTTPException
from opensearchpy import OpenSearch
from pydantic import BaseModel, field_validator
from datetime import datetime
import os

app = FastAPI()

OPENSEARCH_HOST = os.getenv("OPENSEARCH_HOST")
OPENSEARCH_PORT = int(os.getenv("OPENSEARCH_PORT"))

client = OpenSearch(
    hosts=[{"host": OPENSEARCH_HOST, "port": OPENSEARCH_PORT}],
    http_compress=True,
    use_ssl=False,
    verify_certs=False,
)

class LogEntry(BaseModel):
    message: str
    level: str
    timestamp: str
    service: str

    @field_validator('timestamp')
    @classmethod
    def validate_timestamp(cls, v):
        try:
            datetime.fromisoformat(v.replace("Z", "+00:00"))
        except Exception:
            raise HTTPException(status_code=422, detail='timestamp must be a valid ISO 8601 string')
        return v

    @field_validator('level')
    @classmethod
    def validate_level(cls, v):
        valid_levels = {'INFO', 'WARNING', 'ERROR', 'DEBUG'}
        if v not in valid_levels:
            raise HTTPException(status_code=422, detail=f'level must be one of {valid_levels}')
        return v

@app.post("/logs")
async def create_log(log_entry: LogEntry):
    return log_entry
