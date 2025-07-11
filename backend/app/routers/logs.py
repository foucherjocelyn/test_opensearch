from datetime import datetime
from typing import Annotated
from fastapi import APIRouter, HTTPException, Query
from ..dependencies import client
from app.models.log_entry import LogEntry

router = APIRouter(
    prefix="/logs",
    tags=["logs"],
)

@router.post("/")
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

@router.get("/search")
async def search_logs(
    q: str = None,
    level: str = None,
    service: str = None,
    # checks if page is greater than or equal to 1, defaulting to 1
    page: Annotated[int, Query(ge=1)] = 1,
    size: Annotated[int, Query(ge=1)] = 20,  # Number of results per page
):
    from_ = (page - 1) * size  # Calculate the starting index for pagination
    try:
        must_clauses = []
        filter_clauses = []

        # we use .keyword to avoid case sensitivity issues
        if q:
            must_clauses.append({"match": {"message": q}})
        if level:
            filter_clauses.append({"term": {"level.keyword": level}})
        if service:
            filter_clauses.append({"term": {"service.keyword": service}})
        
        # Matches the different fields or everything if no filters are applied
        query = {
            "bool": {
                "must": must_clauses if must_clauses else [{"match_all": {}}],
                "filter": filter_clauses
            }
        }

        response = client.search(index="logs-*", body={
            "size": size,
            "from": from_,
            "query": query,
            "sort": [
                {"timestamp": {"order": "desc"}}
            ],
        })
        return [hit["_source"] for hit in response["hits"]["hits"]]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")