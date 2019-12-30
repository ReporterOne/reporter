from sqlalchemy.orm import Session
from datetime import date, time
from typing import List

from .models import User, DateData, Reason
from db import schemas
from utils.datetime_utils import daterange

# User:
def create_user(db: Session, username: str, password: str) -> User:
    new_user = User(english_name=username,
                    username=username,
                    password=password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def get_user(db: Session, user_id: int) -> User:
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_username(db: Session, username: str) -> User:
    return db.query(User).filter(User.username == username).first()


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

def get_dates_data(db: Session, 
                   user_id: int, 
                   start_date: date, 
                   end_date: date = None) -> List[DateData]:
    if end_date:  #TODO: Bug: if there will be one instance and not many, it wont be a list
        return db.query(DateData).filter(DateData.user_id == user_id, 
                                        start_date <= DateData.date <= end_date).all()
    else:
        return [db.query(DateData).filter(DateData.user_id == user_id, 
                                        start_date == DateData.date).one()]

def get_multiple_users_dates_data(db: Session, 
                                  users_id: List[int],
                                  start_date: date, 
                                  end_date: date = None) -> List[schemas.RangeDatesResponse]:
    return [{'user_id': user_id, 'data': get_dates_data(db, user_id, start_date, end_date)}
            for user_id in users_id]

def _get_reason(db: Session, reason: str) -> str:
    reason_to_return = db.query(Reason).filter(Reason.name == reason).first()
    if reason_to_return is None:
        raise AttributeError(f"Reason: {reason} does not exsists in the DB.")

    return reason_to_return

def set_new_date_data(db: Session, body=schemas.PostDateDataBody) -> schemas.RangeDatesResponse:
    dates_data = []
    for date in daterange(body.start_date, body.end_date):
        if reason is not None:
            reason = _get_reason(db, body.reason)

        dates_data.append(DateData(date=date, user_id=body.user_id,
                                   state=body.state, reason=reason,
                                   reported_by=body.reported_by,
                                   reported_time=body.reported_time))
    db.add_all(dates_data)
    db.commit()
    return {'user_id': body.user_id, 'data': dates_data}

def delete_users_dates_data(db: Session, 
                            users_id: List[int],
                            start_date: date, 
                            end_date: date = None):
    for user_id in users_id:
        dates_data_to_remove = get_dates_data(
            db=db, user_id=user_id, start_date=start_date, end_date=end_date)
        for date_data in dates_data_to_remove:
            db.delete(date_data)

def put_data_in_user(db: Session, body=schemas.PutDateDataBody) -> schemas.RangeDatesResponse:
    request = body.dict()
    if body.reason is not None:
        request["reason"] = _get_reason(db, body.reason)

    dates_data = get_dates_data(db=db, 
                                user_id=request.pop("user_id"),
                                start_date=request.pop("start_date"),
                                end_date=request.pop("end_date"))

    for datedata in dates_data:
        for key, value in body.dict().items():
            if value is not None:
                setattr(datedata, key, value)
    
    db.commit()
    return  {'user_id': body.user_id, 'data': dates_data}

# Reasons:

def get_reasons(db: Session):
    return [reason.name for reason in db.query(Reason).all()]
 