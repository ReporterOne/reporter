# pylint: disable=unused-argument
"""Users api requests."""
from typing import List, Dict
from datetime import date, datetime

from fastapi import APIRouter, Depends, Security, Body
from sqlalchemy.orm import Session

from server import auth

from db import crud
from db import schemas
from db.database import get_db
from utils.datetime_utils import as_dict, fill_missing

router = APIRouter()


@router.get("/me", response_model=schemas.User)
async def get_current_user(
    current_user: schemas.User = Security(auth.get_current_user,
                                          scopes=["personal"])
):
    """Get current user."""
    return current_user


@router.get("/{user_id}", response_model=schemas.User)
async def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Security(auth.get_current_user,
                                          scopes=["personal"])
):
    """Get user."""
    return crud.get_user(
            db=db,
            user_id=user_id
        )


@router.delete("/{user_id}")
async def delete_user(
    user_id: int = None,
    db: Session = Depends(get_db),
    current_user: schemas.User = Security(auth.get_current_user,
                                          scopes=["personal"])
):
    """Delete user."""
    crud.delete_user(db=db, user_id=user_id)


@router.get("/{user_id}/commander_id")
async def get_commander(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Security(auth.get_current_user,
                                          scopes=["personal"])
) -> int:
    """Get commander."""
    return crud.get_commander_id(db=db, user_id=user_id)


@router.get("/{user_id}/subjects", response_model=List[schemas.User])
async def get_subjects(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Security(auth.get_current_user,
                                          scopes=["personal"])
):
    """Get subjects."""
    return crud.get_subjects(
            db=db,
            commander_id=user_id
        )


def get_calendar_of_user(db, user_id, start, end):
    date_details = crud.get_dates_data_of(db, [user_id], start, end)
    details = as_dict(date_details)

    if end is None:
        end = start

    return fill_missing(details, [user_id], start, end, flat=True)


def post_calendar_of_user(db, user_id, start, end, state, reason,
                          current_user):
    response = crud.set_new_date_data(
        db=db,
        user_id=user_id,
        start_date=start,
        end_date=end,
        state=state,
        reason=reason,
        reported_by_id=current_user.id,
        reported_time=datetime.now()
    )
    return response


@router.get("/me/statuses",
            response_model=List[schemas.CalendarResponseSingle])
async def get_calendar_me(
    start: date,
    end: date = None,
    db: Session = Depends(get_db),
    current_user: schemas.User = Security(auth.get_current_user,
                                          scopes=["personal"])
):
    """Get calendar data of user."""
    user_id = current_user.id
    return get_calendar_of_user(user_id=user_id, start=start, end=end, db=db)


@router.post("/me/statuses",
             response_model=Dict[date, schemas.DateDataResponse])
async def post_calendar_me(
    start: date = Body(...),
    end: date = Body(None),
    state: schemas.AnswerStateTypes = Body(...),
    reason: str = Body(None),
    db: Session = Depends(get_db),
    current_user: schemas.User = Security(auth.get_current_user,
                                          scopes=["personal"])
):
    """Get calendar data of user."""
    user_id = current_user.id
    return post_calendar_of_user(user_id=user_id, start=start, end=end,
                                 reason=reason, state=state,
                                 db=db, current_user=current_user)


@router.get("/{user_id}/statuses",
            response_model=List[schemas.CalendarResponseSingle])
async def get_calendar(
    user_id: int,
    start: date,
    end: date = None,
    db: Session = Depends(get_db),
    current_user: schemas.User = Security(auth.get_current_user,
                                          scopes=["personal"])
):
    """Get calendar data of user."""
    return get_calendar_of_user(user_id=user_id, start=start, end=end, db=db)


@router.post("/{user_id}/statuses",
             response_model=Dict[date, schemas.DateDataResponse])
async def post_user_calendar(
    user_id: int,
    start: date = Body(...),
    end: date = Body(None),
    state: schemas.AnswerStateTypes = Body(...),
    reason: str = Body(None),
    db: Session = Depends(get_db),
    current_user: schemas.User = Security(auth.get_current_user,
                                          scopes=["personal"])
):
    """Get calendar data of user."""
    return post_calendar_of_user(user_id=user_id, start=start, end=end,
                                 reason=reason, state=state,
                                 db=db, current_user=current_user)
