from sqlalchemy.orm import Session
from datetime import date, time
from typing import List

from db.models import User


def create_user(
    db: Session,
    username: str,
    password: str
) -> User:
    new_user = User(english_name=username,
                    username=username,
                    password=password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def get_user(
    db: Session,
    user_id: int
) -> User:
    return db.query(User).filter(User.id == user_id).first()


def get_users(
    db: Session,
    users_id: List[int]
) -> List[User]:
    return [get_user(db=db, user_id=user_id) for user_id in users_id]


def get_user_by_username(
    db: Session,
    username: str
) -> User:
    return db.query(User).filter(User.username == username).first()


def get_subjects(
    db: Session,
    commander_id: int
) -> List[User]:
    commander = get_user(db, commander_id)
    return commander.soldiers


def get_reminder(
    db: Session,
    user_id: int
) -> time:
    user = get_user(db, user_id)
    return user.reminder_time


def was_reminded(
    db: Session,
    user_id: int
) -> bool:
    user = get_user(db, user_id)
    return user.last_reminded_date >= date.today()
