# pylint: disable=unused-argument
"""Dates data api requests."""
from typing import List
from datetime import date, datetime
from sqlalchemy.orm import Session
from fastapi import APIRouter, Query, Depends, Security, Body

from db import crud, schemas
from db.database import get_db
from server.auth import get_current_user

router = APIRouter()


@router.get("/", response_model=List[schemas.RangeDatesResponse])
async def get_dates_status(
    start: date,
    end: date = None,
    users_id: List[int] = Query([]),
    db: Session = Depends(get_db),
    current_user: schemas.User = Security(get_current_user,
                                          scopes=["personal"])
):
    """Get dates status."""
    return crud.get_multiple_users_dates_data(db=db,
                                              start_date=start,
                                              end_date=end,
                                              users_id=users_id)


@router.delete("/")
async def delete_dates_status(
    user_id: int = Body(...),
    start_date: date = Body(...),
    end_date: date = Body(None),
    db: Session = Depends(get_db)
):
    """Delete dates status."""
    crud.delete_users_dates_data(db=db,
                                 start_date=start_date,
                                 end_date=end_date,
                                 user_id=user_id)


@router.post("/", response_model=schemas.RangeDatesResponse)
async def post_dates_status(
    body: schemas.PostDateDataBody,
    db: Session = Depends(get_db),
    current_user: schemas.User = Security(get_current_user,
                                          scopes=["personal"])
):
    """Post dates status."""
    # TODO: add user access validation

    response = crud.set_new_date_data(
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
    return crud.get_reasons(db=db)
