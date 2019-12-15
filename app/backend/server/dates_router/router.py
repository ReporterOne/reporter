from fastapi import APIRouter, Query, HTTPException
from typing import List
from datetime import date, time
from utils.datetime_utils import daterange

from db.models import *
from db.crud import *

from server.common.base_models import Mador, PostDates, User, GetDate, DatesResponce

router = APIRouter()


@router.get("/api/v1/dates_status", response_model=DatesResponce)
async def get_dates_status(start: date, end: date = None, user_id: List[int] = Query([])):
    # TODO: handle if some iser_id was not found and raise an error maybe.
    response = []
    with transaction() as session:
        for day in daterange(start, end):
            date_objects = session.query(DateData).filter(DateData.date == day)
            for user in user_id:
                date_per_user = date_objects.filter(DateData.user_id == user).first()
                if date_per_user:
                    response.append(GetDate(date=day, 
                                            reason=date_per_user.reason,
                                            type=date_per_user.date_details.type,
                                            users_id=user))

                else:
                    response.append(GetDate(date=day,
                                            type=date_per_user.date_details.type,
                                            users_id=user))

    if response == []:
        raise HTTPException(status_code=404, detail="No objects was found in th db.")

    return response


@router.post("/api/v1/dates_status")
async def post_dates_status(dates: PostDates):
    return dates


@router.delete("/api/v1/dates_status")
async def delete_dates_status(dates: PostDates = None):    
    if dates:
        return
        
    print("deleting today")


