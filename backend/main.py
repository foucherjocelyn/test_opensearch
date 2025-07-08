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
    timestamp: str
    level: str
    message: str
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
    try:
        # Parse the timestamp to get the date for the index name
        date_obj = datetime.fromisoformat(log_entry.timestamp.replace("Z", "+00:00"))
        index_name = f"logs-{date_obj.strftime('%Y.%m.%d')}"

        # Create the index if it doesn't exist
        if not client.indices.exists(index=index_name):
            client.indices.create(index=index_name)

        # Insert the log entry
        response = client.index(index=index_name, body=log_entry.model_dump(), refresh=True)
        return {
            "id": response.get("_id"),
            "log": log_entry.model_dump()
        }
    except HTTPException:
        raise  # Let FastAPI handle HTTPExceptions from validation
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/logs/search")
async def search_logs():
    try:
        response = client.search(index="logs-*", body={
            "size": 20,
            "query": {
                "match_all": {}
            },
            "sort": [
                {"timestamp": {"order": "desc"}}
            ],
        })
        return [hit["_source"] for hit in response["hits"]["hits"]]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")