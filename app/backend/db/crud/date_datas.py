"""Dates datas api with db."""
from http import HTTPStatus
from typing import List
from datetime import date, datetime

from sqlalchemy.orm import Session
from fastapi import HTTPException

from db import schemas
from db.models import DateData, DateDetails, Reason
from utils.datetime_utils import daterange, as_dict
from .reasons import get_reason_by_name
from .crud_utils import put_values


def _get_single_date(
    db: Session,
    user_id: int,
    start_date: date,
) -> DateData:
    """Get single date data from the db.

    Args:
        user_id: the relevant user id.
        start_date: the date that is looked for.

    Returns:
        the wanted date data of the user.
    """
    return db.query(DateData).filter(
        DateData.user_id == user_id,
        start_date == DateData.date
    ).first()


def _get_single_date_of(
    db: Session,
    user_ids: List[int],
    start_date: date,
) -> DateData:
    """Get single date data from the db.

    Args:
        user_ids: the relevant user id.
        start_date: the date that is looked for.

    Returns:
        the wanted date data of the user.
    """
    return db.query(DateDetails).join(DateData).filter(
        DateData.user_id.in_(user_ids),
        start_date == DateDetails.date
    ).first()


def get_dates_data_of(
    db: Session,
    user_ids: List[int],
    start_date: date,
    end_date: date = None
) -> List[DateDetails]:
    """Get date details from the db.

    Args:
        db: db session.
        user_ids: list of relavent user id.
        start_date: date of the start range.
        end_date: date of the end range (default: None).

    Returns:
        list of date details between start_date and end_date.
    """
    if end_date:
        return db.query(DateDetails).join(DateData).filter(
            DateData.user_id.in_(user_ids),
            start_date <= DateDetails.date,
            DateDetails.date <= end_date
        ).all()

    data = _get_single_date_of(db, user_ids, start_date)
    if data:
        return [data]

    return []


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
            start_date <= DateData.date,
            DateData.date <= end_date
        ).all()

    data = _get_single_date(db, user_id, start_date)
    if data:
        return [data]

    return []


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
    make_if_not_exists: bool = False,
    should_commit: bool = False,
) -> DateDetails:
    """Get date details from a specific date.

    Args:
        db: the related db session.
        date: date for the details.
        make_if_not_exists: a flag, if True will create date
                            details if the date was not found.
        should_commit: a flag, if True commit, else dont commit.

    Returns:
        date details of the specified date.
    """
    date_details = db.query(DateDetails).filter(
        DateDetails.date == day).first()
    if make_if_not_exists and date_details is None:
        date_details = DateDetails(date=day)
        db.add(date_details)
        if should_commit:
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
) -> Dict[date, schemas.DateDataResponse]:
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

    elif reason is None and state.name == Reason.NOT_HERE:
        raise HTTPException(status_code=HTTPStatus.BAD_REQUEST,
                            detail='Cannot sign as "not_here" with no reason.')

    dates_data = []
    db_query = get_dates_data(db, user_id, start_date, end_date)
    db_query = as_dict(db_query)
    for day in daterange(start_date, end_date):
        if day in db_query:
            # modify existing one
            date_data = db_query[day]
            data = put_values(
                db=db,
                obj=date_data,
                state=state,
                reason=reason,
                reported_by_id=reported_by_id,
                reported_time=reported_time
            )

        else:
            # create new one if not exists
            date_details = _get_date_details(
                db=db,
                day=day,
                make_if_not_exists=True
            )
            data = DateData(
                user_id=user_id,
                state=state.name,
                reason=reason,
                reported_by_id=reported_by_id,
                reported_time=reported_time,
                date_details=date_details
            )
            db.add(data)

        dates_data.append(data)
    db.commit()
    return as_dict(dates_data)


def delete_users_dates_data(
    db: Session,
    user_id: int,
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
    dates_data_to_remove = get_dates_data(
        db=db,
        user_id=user_id,
        start_date=start_date,
        end_date=end_date
    )

    for date_data in dates_data_to_remove:
        db.delete(date_data)

    db.commit()
