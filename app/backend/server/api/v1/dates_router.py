from typing import List
from datetime import date
from sqlalchemy.orm import Session
from fastapi import APIRouter, Query, Depends, Security

from server.auth import get_current_user

from db import crud
from db import schemas
from db.database import get_db

router = APIRouter()


@router.get("/dates_status", response_model=List[schemas.DateResponse])
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


@router.get("/dates_status/reasons", response_model=List[str])
def get_reasons(
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    return crud.get_reasons(db)
