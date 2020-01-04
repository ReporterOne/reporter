"""DateDatas interface with db."""
from typing import List
from datetime import date

from sqlalchemy.orm import Session

from db import schemas
from db.models import DateData


def get_dates_data(
    db: Session,
    user_id: int,
    start_date: date,
    end_date: date = None
) -> List[DateData]:
    """Get Date Datas from db.

    Args:
        db: db session.
        user_id: user id to get date datas of.
        start_date: date of the start range.
        end_date: date of the end range (default: None).

    Returns:
        list of date datas between start_date and end_date.
    """
    if end_date:
        return db.query(DateData).filter(
            DateData.user_id == user_id,
            start_date <= DateData.date <= end_date
        ).all()

    return db.query(DateData).filter(
        DateData.user_id == user_id,
        start_date == DateData.date
    ).all()


def get_multiple_users_dates_data(
    db: Session,
    users_id: List[int],
    start_date: date,
    end_date: date = None
) -> List[schemas.DateResponse]:
    """Get multiple users date datas from db.

    Args:
        db: the related db session.
        users_id: list of users id.
        start_date: date of the start range.
        end_date: date of the end range (default: None).

    Returns:
        list of date datas between start_date and end_date.
    """
    return [
        {
            'user_id': user_id,
            'data': get_dates_data(db, user_id, start_date, end_date)
        }
        for user_id in users_id
    ]
