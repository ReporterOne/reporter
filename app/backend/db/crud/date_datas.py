"""Dates datas api with db."""
from typing import List
from datetime import date, datetime

from sqlalchemy.orm import Session

from db import schemas
from db.models import DateData, DateDetails, Reason
from utils.datetime_utils import daterange
from .reasons import get_reason_by_name
from .crud_utils import put_values_if_not_none


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
) -> List[schemas.RangeDatesResponse]:
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


def _get_date_details(
    db: Session,
    day: date,
    make_if_not_exists: bool = False
) -> DateDetails:
    """Get date details from a specific date.

    Args:
        db: the related db session.
        date: date for the details.
        make_if_not_exists: a flag, if True will create date
                            details if the date was not found.

    Returns:
        date details of the specified date.
    """
    date_details = db.query(DateDetails).filter(
        DateDetails.date == day).first()
    if make_if_not_exists and date_details is None:
        date_details = DateDetails(day=day)
        db.add(date_details)
        db.commit()
        db.refresh(date_details)

    return date_details


def set_new_date_data(
    db: Session,
    user_id: int,
    state: schemas.AnswerStateTypes,
    reported_by_id: int,
    reported_time: datetime,
    start_date: date,
    end_date: date = None,
    reason: str = None
) -> schemas.RangeDatesResponse:
    """Set Date Data to user.

    Args:
        db: db session.
        user_id: user id to set date datas to.
        state: the state of this day - here/ not here.
        reported_by_id: the id of the reporter of this status.
        reported_time: the time that the status was posted.
        start_date: date of the start range.
        end_date: date of the end range (default: None).
        reason: reason that you are not here/ here. (default: None).

    Returns:
        date datas between start_date and end_date.
    """
    if reason is not None:
        reason = get_reason_by_name(db, reason)

    elif state.name == Reason.NOT_HERE:
        raise RuntimeError('Cannot sign as "not_here"'
                           'with no reason.')

    dates_data = []
    for day in daterange(start_date, end_date):

        date_details = _get_date_details(
            db=db,
            day=day,
            make_if_not_exists=True
        )

        dates_data.append(DateData(
                date_details=date_details,
                user_id=user_id,
                state=state,
                reason=reason,
                reported_by_id=reported_by_id,
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
    """Delete Date Data for user.

    Args:
        db: db session.
        user_id: user id to delete date datas for.
        start_date: date of the start range.
        end_date: date of the end range (default: None).
    """
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
    user_id: int,
    start_date: date,
    end_date: date = None,
    state: schemas.AnswerStateTypes = None,
    reason: str = None,
    reported_by_id: int = None,
    reported_time: datetime = None
) -> schemas.RangeDatesResponse:
    """Put Date Data to user.

    Args:
        db: db session.
        user_id: user id to put date datas to.
        start_date: date of the start range.
        end_date: date of the end range (default: None).
        state: the state of this day - here/ not here. (default: None).
        reason: reason that you are not here/ here. (default: None).
        reported_by_id: the id of the reporter of this status. (default: None).
        reported_time: the time that the status was posted. (default: None).

    Returns:
        date datas between start_date and end_date.
    """
    if reason is not None:
        reason = get_reason_by_name(db, reason)

    dates_data = get_dates_data(
            db=db,
            user_id=user_id,
            start_date=start_date,
            end_date=end_date
        )

    for datedata in dates_data:
        put_values_if_not_none(
                db=db,
                obj=datedata,
                state=state,
                reason=reason,
                reported_by_id=reported_by_id,
                reported_time=reported_time
            )

    return dict(user_id=user_id, date=dates_data)
