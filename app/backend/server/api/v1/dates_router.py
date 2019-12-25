from typing import List
from datetime import date, time
from sqlalchemy.orm import Session
from fastapi import APIRouter, Query, Depends, HTTPException

from db.database import transaction
from db.crud import (get_multiple_users_dates_data, 
                     set_new_date_data, 
                     delete_users_dates_data)
from db import schemas

router = APIRouter()


@router.get("/dates_status", response_model=List[schemas.DateResponse])
async def get_dates_status(start: date, end: date = None, users_id: List[int] = Query([]), db: Session = Depends(transaction)):
    return get_multiple_users_dates_data(db=db,
                                         start_date=start, 
                                         end_date=end, 
                                         users_id=users_id)

@router.post("/dates_status", response_model=schemas.DateResponse)
async def post_dates_status(body: schemas.DateDataBody, db: Session = Depends(transaction)):
    return set_new_date_data(db=db, body=body)

@router.delete("/dates_status")
async def delete_dates_status(start: date, end: date = None, users_id: List[int] = Query([]), db: Session = Depends(transaction)):
    delete_users_dates_data(db=db,
                            start_date=start, 
                            end_date=end, 
                            users_id=users_id)

@router.put("/dates_status", response_model=schemas.DateResponse)
async def put_dates_status(body: schemas.DateDataBody, db: Session = Depends(transaction)):
    pass  #TODO
