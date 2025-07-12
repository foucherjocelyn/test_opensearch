from typing import Annotated
from fastapi import Query
from pydantic import BaseModel


class LogSearchParams(BaseModel):
    q: Annotated[str | None, Query(max_length=100)] = None
    level: Annotated[str | None, Query(max_length=100)] = None
    service: Annotated[str | None, Query(max_length=100)] = None
    # checks if page is greater than or equal to 1, defaulting to 1
    page: Annotated[int | None, Query(ge=1)] = 1
    size: Annotated[int | None, Query(ge=1)] = 20  # Number of results per page
