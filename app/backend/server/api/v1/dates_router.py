from typing import List
from datetime import date
from sqlalchemy.orm import Session
from fastapi import APIRouter, Query, Depends, Security

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
    return crud.get_multiple_users_dates_data(db=db,
                                              start_date=start,
                                              end_date=end,
                                              users_id=users_id)

@router.post("/", response_model=schemas.RangeDatesResponse)
async def post_dates_status(
    body: schemas.PostDateDataBody,
    db: Session = Depends(get_db),
    current_user: schemas.User = Security(get_current_user,
                                          scopes=["personal"])
):
    return crud.set_new_date_data(db=db, 
                start_date=body.start_date,
                end_date=body.end_date,
                state=body.state,
                reason=body.reason,
                reported_by_id=body.reported_by_id,
                reported_time=body.reported_time
            )

@router.delete("/")
async def delete_dates_status(
    start: date, 
    end: date = None, 
    users_id: List[int] = Query([]), 
    db: Session = Depends(get_db)
):
    crud.delete_users_dates_data(db=db,
                            start_date=start, 
                            end_date=end, 
                            users_id=users_id)

@router.put("/", response_model=schemas.RangeDatesResponse)
async def put_dates_status(
    body: schemas.PutDateDataBody,
    db: Session = Depends(get_db),
    current_user: schemas.User = Security(get_current_user,
                                          scopes=["personal"])
):
    return crud.put_data_in_user(
            db=db, 
            start_date=body.start_date,
            end_date=body.end_date,
            state=body.state,
            reason=body.reason,
            reported_by_id=body.reported_by_id,
            reported_time=body.reported_time
        )

@router.get("/reasons", response_model=List[str])
def get_reasons(
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    return crud.get_reasons(db)
