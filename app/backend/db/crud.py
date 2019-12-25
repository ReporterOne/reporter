from sqlalchemy.orm import Session
from datetime import date, time
from typing import List

from .models import User, DateData
from db import schemas

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

def get_dates_data(db: Session, user_id: int, 
                   start_date: date, end_date: date = None) -> List[DateData]:
    if end_date:
        return db.query(DateData).filter(DateData.user_id == user_id, 
                                        start_date <= DateData.date <= end_date).all()
    else:
        return db.query(DateData).filter(DateData.user_id == user_id, 
                                        start_date == DateData.date).all()

def get_multiple_users_dates_data(db: Session, users_id: List[int],
                                  start_date: date, end_date: date = None) -> List[schemas.DateResponse]:
    return [{'user_id': user_id, 'data': get_dates_data(db, user_id, start_date, end_date)}
            for user_id in users_id]
