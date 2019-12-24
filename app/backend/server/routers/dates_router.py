from typing import List
from datetime import date, time
from sqlalchemy.orm import Session
from fastapi import APIRouter, Query, Depends, HTTPException

from db.models import *
from db.database import transaction
from db.crud import get_multiple_users_dates_data
from db import schemas

router = APIRouter()


@router.get("/dates_status", response_model=List[schemas.DateResponse])
async def get_dates_status(start: date, end: date = None, users_id: List[int] = Query([]), db: Session = Depends(transaction)):
    return get_multiple_users_dates_data(db=db,
                                         start_date=start, 
                                         end_date=end, 
                                         users_id=users_id)
