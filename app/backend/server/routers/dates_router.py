from fastapi import APIRouter, Query, Depends, HTTPException
from typing import List
from datetime import date, time
from utils.datetime_utils import daterange

from db.models import *
from db.database import transaction
from db.crud import get_multiple_users_redused_dates_data
from db import schemas

router = APIRouter()


@router.get("/api/v1/dates_status", response_model=schemas.MultipleUsersDatesResponce)
async def get_dates_status(start: date, end: date = None, users_id: List[int] = Query([])):
    return get_multiple_users_redused_dates_data(db=Depends(transaction),
                                                 start_date=start, 
                                                 end_date=end, 
                                                 users_id=users_id)
