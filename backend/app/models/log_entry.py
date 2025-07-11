from datetime import datetime
from fastapi import HTTPException
from pydantic import BaseModel, field_validator

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