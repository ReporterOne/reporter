from sqlalchemy.orm import Session
from datetime import date, time
from typing import List

from db.models import DateData
from db import schemas


def get_dates_data(
    db: Session,
    user_id: int,
    start_date: date,
    end_date: date = None
) -> List[DateData]:
    if end_date:
        return db.query(DateData).filter(DateData.user_id == user_id,
                                         start_date <= DateData.date <=
                                         end_date).all()
    else:
        return db.query(DateData).filter(DateData.user_id == user_id,
                                         start_date == DateData.date).all()


def get_multiple_users_dates_data(
    db: Session,
    users_id: List[int],
    start_date: date,
    end_date: date = None
) -> List[schemas.DateResponse]:
    return [
        {
            'user_id': user_id,
            'data': get_dates_data(db, user_id, start_date, end_date)
        }
        for user_id in users_id
    ]
