# pylint: disable=unused-argument
"""Dates data api requests."""
from typing import List
from datetime import date
from sqlalchemy.orm import Session
from fastapi import APIRouter, Query, Depends, Security

from db import crud, schemas
from db.database import get_db
from server.auth import get_current_user
from utils.datetime_utils import as_dict, fill_missing


router = APIRouter()


@router.get("/", response_model=List[schemas.CalendarResponse])
async def get_dates_status(
    start: date,
    end: date = None,
    users_id: List[int] = Query([]),
    db: Session = Depends(get_db),
    current_user: schemas.User = Security(get_current_user,
                                          scopes=["personal"])
):
    """Get dates status."""
    date_details = crud.get_dates_data_of(db, users_id, start, end)
    details = as_dict(date_details)

    if end is None:
        end = start

    return fill_missing(details, users_id, start, end, flat=False)
