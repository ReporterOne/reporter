from sqlalchemy.orm import Session
from datetime import date, time
from typing import List

from .models import User, DateData, Reason
from db import schemas
from utils.datetime_utils import daterange

# User:

def get_user(db: Session, user_id: int) -> User:
    return db.query(User).filter(User.id == user_id).one()

def get_subjects(db: Session, commander_id: int) -> List[User]:
    commander = get_user(db, commander_id)
    return commander.soldiers

def get_reminder(db: Session, user_id:int) -> time:
    user = get_user(db, user_id)
    return user.reminder_time

def was_reminded(db: Session, user_id: int) -> bool:
    user = get_user(db, user_id)
    return user.last_reminded_date == date.today()

# Date Data:

def get_dates_data(db: Session, user_id: int, 
                   start_date: date, end_date: date = None) -> List[DateData]:
    if end_date:  #TODO: Bug: if there will be one instance and not many, it wont be a list
        return db.query(DateData).filter(DateData.user_id == user_id, 
                                        start_date <= DateData.date <= end_date).all()
    else:
        return [db.query(DateData).filter(DateData.user_id == user_id, 
                                        start_date == DateData.date).one()]

def get_multiple_users_dates_data(db: Session, users_id: List[int],
                                          start_date: date, end_date: date = None) -> List[schemas.DateResponse]:
    return [{'user_id': user_id, 'data': get_dates_data(db, user_id, start_date, end_date)}
            for user_id in users_id]

def set_new_date_data(db: Session, body=schemas.DateDataBody) -> schemas.DateResponse:
    dates_data = []
    for date in daterange(body.start_date, body.end_date):
        reason = db.query(Reason).filter(Reason.name == body.reason).one()
        if (not reason) and body.state != schemas.AnswerStateTypes.here:
            raise AttributeError(f"Reason: {reason} does not exsists in the DB.")

        dates_data.append(DateData(date=date, user_id=body.user_id,
                                   state=body.state, reason=reason,
                                   reported_by=body.reported_by,
                                   reported_time=body.reported_time))
    db.add_all(dates_data)
    db.commit()
    return {'user_id': body.user_id, 'data': dates_data}

def delete_users_dates_data(db: Session, users_id: List[int],
                            start_date: date, end_date: date = None)
    for user_id in users_id:
        dates_data_to_remove = get_dates_data(
            db=db, user_id=user_id, start_date=start_date, end_date=end_date)
        for date_data in dates_data_to_remove:
            db.delete(date_data)

def put_data_in_user(db: Session, body=schemas.DateDataBody) -> schemas.DateResponse:
    pass  #TODO
