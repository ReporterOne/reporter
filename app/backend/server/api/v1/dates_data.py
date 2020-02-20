# pylint: disable=unused-argument
"""Dates data api requests."""
from typing import List, Dict
from datetime import date, datetime
from sqlalchemy.orm import Session
from fastapi import APIRouter, Query, Depends, Security, Body

from db import crud, schemas
from db.database import get_db
from server.auth.utils import get_current_user
from utils.datetime_utils import as_dict, fill_missing
from .security import secure_user_accessing

router = APIRouter()


def get_calendar_of_users(db, users_id, start, end):
    date_details = crud.date_datas.get_dates_data_of(db, users_id, start, end)
    details = as_dict(date_details)

    if end is None:
        end = start

    return fill_missing(details, users_id, start, end)


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
    with secure_user_accessing(db, current_user, users_id):
        return get_calendar_of_users(db=db, users_id=users_id, start=start,
                                     end=end)


@router.delete("/")
async def delete_dates_status(
    user_id: int = Body(...),
    start_date: date = Body(...),
    end_date: date = Body(None),
    db: Session = Depends(get_db),
    current_user: schemas.User = Security(get_current_user,
                                          scopes=["personal"])

):
    """Delete dates status."""
    with secure_user_accessing(db, current_user, [user_id]):
        crud.date_datas.delete_users_dates_data(db=db,
                                                start_date=start_date,
                                                end_date=end_date,
                                                user_id=user_id)


@router.post("/", response_model=Dict[date, schemas.DateDataResponse])
async def post_dates_status(
    body: schemas.PostDateDataBody,
    db: Session = Depends(get_db),
    current_user: schemas.User = Security(get_current_user,
                                          scopes=["personal"])
):
    """Post dates status."""
    with secure_user_accessing(db, current_user, [body.user_id]):
        response = crud.date_datas.set_new_date_data(
            db=db,
            user_id=body.user_id,
            start_date=body.start_date,
            end_date=body.end_date,
            state=body.state,
            reason=body.reason,
            reported_by_id=current_user.id,
            reported_time=datetime.now()
        )
        return response


@router.get("/reasons", response_model=List[str])
async def get_reasons(
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    """Get all reasons."""
    return crud.reasons.get_reasons(db=db)
