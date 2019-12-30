from typing import List
from sqlalchemy.orm import Session
from datetime import date, time, datetime

from db import schemas
from db.models import DateData
from .reasons import get_reason_by_name
from utils.datetime_utils import daterange


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
    user_id: int,
    start_date: date,
    end_date: date = None,
    state: schemas.AnswerStateTypes = None,
    reason: str = None,
    reported_by_id: int = None,
    reported_time: datetime = None
) -> schemas.RangeDatesResponse:

    dates_data = []
    for date in daterange(start_date, end_date):
        if reason is not None:
            reason = get_reason_by_name(db, reason)
        
        elif state.name == 'not_here':
            raise RuntimeError('Cannot sign as "not_here"' 
                               'with no reason.')

        dates_data.append(DateData(
                date=date, 
                user_id=user_id,
                state=state, 
                reason=reason, 
                reported_by=reported_by, 
                reported_time=reported_time
            ))
    db.add_all(dates_data)
    db.commit()
    return dict(user_id=user_id, date=dates_data)


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
    
    db.commit()

def put_data_in_user(
    db: Session, 
    start_date: date,
    end_date: date = None,
    state: schemas.AnswerStateTypes = None,
    reason: str = None,
    reported_by_id: int = None,
    reported_time: datetime = None
) -> schemas.RangeDatesResponse:


    if reason is not None:
        reason = get_reason_by_name(db, reason)

    dates_data = get_dates_data(
            db=db, 
            user_id=user_id,
            start_date=start_date,
            end_date=end_date
        )

    for datedata in dates_data:
        if state is not None:
            datedata.state = state

        if reason is not None:
            datedata.reason = reason

        if reported_by_id is not None:
            datedata.reported_by_id = reported_by_id

        if reported_time is not None:
            datedata.reported_time = reported_time
    
    db.commit()
    return dict(user_id=user_id, date=dates_data)
