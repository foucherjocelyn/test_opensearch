from datetime import datetime
from typing import Annotated
from fastapi import HTTPException, Query
from pydantic import BaseModel, field_validator


class LogSearchParams(BaseModel):
    q: Annotated[str | None, Query(max_length=100)] = None
    level: Annotated[str | None, Query(max_length=100)] = None
    service: Annotated[str | None, Query(max_length=100)] = None
    # checks if page is greater than or equal to 1, defaulting to 1
    page: Annotated[int | None, Query(ge=1)] = 1
    size: Annotated[int | None, Query(ge=1)] = 20  # Number of results per page
    start_date: Annotated[str | None, Query(max_length=10)] = None  # YYYY-MM-DD format
    end_date: Annotated[str | None, Query(max_length=10)] = None

    @field_validator("start_date", "end_date")
    @classmethod
    def validate_date_format(cls, v):
        if v:
            try:
                datetime.strptime(v, "%Y-%m-%d")
            except ValueError:
                raise HTTPException(status_code=422, detail="Date must be in YYYY-MM-DD format")
        return v
            