from datetime import datetime
from typing import Annotated
from fastapi import APIRouter, HTTPException, Query

from ..dependencies import client
from app.models.log_search_params import LogSearchParams
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
    params: Annotated[LogSearchParams, Query()],
):
    from_ = (params.page - 1) * params.size  # Calculate the starting index for pagination
    try:
        must_clauses = []
        filter_clauses = []

        # we use .keyword to avoid case sensitivity issues
        if params.q:
            must_clauses.append({"match": {"message": params.q}})
        if params.level:
            filter_clauses.append({"term": {"level.keyword": params.level}})
        if params.service:
            filter_clauses.append({"term": {"service.keyword": params.service}})
        if params.start_date:
            filter_clauses.append({"range": {"timestamp": {"gte": f"{params.start_date}T00:00:00Z"}}})
        if params.end_date:
            filter_clauses.append({"range": {"timestamp": {"lte": f"{params.end_date}T23:59:59Z"}}})

        print(f"filter_clauses: {filter_clauses}")
        
        # Matches the different fields or everything if no filters are applied
        query = {
            "bool": {
                "must": must_clauses if must_clauses else [{"match_all": {}}],
                "filter": filter_clauses
            }
        }

        response = client.search(index="logs-*", body={
            "size": params.size,
            "from": from_,
            "query": query,
            "sort": [
                {"timestamp": {"order": "desc"}}
            ],
        })
        return [hit["_source"] for hit in response["hits"]["hits"]]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")