from typing import List
from datetime import date
from sqlalchemy.orm import Session
from fastapi import APIRouter, Query, Depends

from server.auth import get_current_user_secured

from db import schemas
from db.database import get_db
from db.crud import get_multiple_users_dates_data

router = APIRouter()


@router.get("/dates_status", response_model=List[schemas.DateResponse])
async def get_dates_status(
    start: date,
    end: date = None,
    users_id: List[int] = Query([]),
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user_secured)
):
    return get_multiple_users_dates_data(db=db,
                                         start_date=start, 
                                         end_date=end, 
                                         users_id=users_id)
