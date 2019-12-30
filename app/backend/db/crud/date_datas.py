from sqlalchemy.orm import Session
from datetime import date, time
from typing import List
from utils.datetime_utils import daterange

from db.models import DateData
from db import schemas
from .reasons import get_reason_by_name


def get_dates_data(
    db: Session,
    user_id: int,
    start_date: date,
    end_date: date = None
) -> List[DateData]:

    if end_date:
        return db.query(DateData).filter(
            DateData.user_id == user_id,
            start_date <= DateData.date <= end_date
        ).all()
    else:
        return db.query(DateData).filter(
            DateData.user_id == user_id,
            start_date == DateData.date
        ).all()


def get_multiple_users_dates_data(
    db: Session,
    users_id: List[int],
    start_date: date,
    end_date: date = None
) -> List[schemas.RangeDatesResponse]:

    return [
        {
            'user_id': user_id,
            'data': get_dates_data(db, user_id, start_date, end_date)
        }
        for user_id in users_id
    ]


def set_new_date_data(
    db: Session, 
    body=schemas.PostDateDataBody
) -> schemas.RangeDatesResponse:

    dates_data = []
    for date in daterange(body.start_date, body.end_date):
        if reason is not None:
            reason = get_reason_by_name(db, body.reason)

        dates_data.append(DateData(
                date=date, 
                user_id=body.user_id,
                state=body.state, 
                reason=reason, 
                reported_by=body.reported_by, 
                reported_time=body.reported_time
            ))
    db.add_all(dates_data)
    db.commit()
    return {'user_id': body.user_id, 'data': dates_data}


def delete_users_dates_data(
    db: Session,
    users_id: List[int],
    start_date: date,
    end_date: date = None
):

    for user_id in users_id:
        dates_data_to_remove = get_dates_data(
                db=db, 
                user_id=user_id, 
                start_date=start_date, 
                end_date=end_date
            )

        for date_data in dates_data_to_remove:
            db.delete(date_data)

def put_data_in_user(
    db: Session, 
    body=schemas.PutDateDataBody
) -> schemas.RangeDatesResponse:

    request = body.dict()
    if body.reason is not None:
        request["reason"] = get_reason_by_name(db, body.reason)

    dates_data = get_dates_data(
            db=db, 
            user_id=request.pop("user_id"),
            start_date=request.pop("start_date"),
            end_date=request.pop("end_date")
        )

    for datedata in dates_data:
        for key, value in body.dict().items():
            if value is not None:
                setattr(datedata, key, value)
    
    db.commit()
    return  {'user_id': body.user_id, 'data': dates_data}
