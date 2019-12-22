from sqlalchemy.orm import Session
from datetime import date, time
from typing import List

from .models import User, DateData
from utils.datetime_utils import daterange
from db import schemas

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
    return db.query(DateData).filter(DateData.user_id == user_id, 
                                     start_date <= DateData.date <= end_date).all()

def get_reduced_dates_data(db: Session, user_id: int, 
                           start_date: date, end_date: date = None) -> List[schemas.DateData]:
    """Return list of DateData after adding follow same dates into range."""
    dates_data = get_dates_data(db, user_id, start_date, end_date)
    responce = []
    for i in range(len(dates_data)):
        if i > 0 and dates_data[-1] == dates_data:
            responce[-1].end_date = dates_data[i].date
        
        else:
            responce.append(schemas.DateData(user=dates_data[i].user,
                                             start_date=dates_data[i].date, 
                                             state=dates_data[i].state,
                                             reported_by=dates_data[i].reported_by,
                                             reason=dates_data[i].reason,
                                             date_details=dates_data[i].date_details))
    return responce

def get_multiple_users_redused_dates_data(db: Session, users_id: List[int],
                                          start_date: date, end_date: date = None) -> schemas.MultipleUsersDatesResponce:
    return [schemas.DateResponce(user_id=user_id, data=get_reduced_dates_data(db, user_id, start_date, end_date)) 
            for user_id in users_id]