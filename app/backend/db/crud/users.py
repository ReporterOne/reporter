"""Users api with db."""
from typing import List
from datetime import date, time

from sqlalchemy.orm import Session

from db.models import User


def create_user(
    db: Session,
    username: str,
    password: str
) -> User:
    """Create new user in db.

    Args:
        db: the related db session.
        username: the required username.
        password: the required password.

    Returns:
        the newly created user.
    """
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
    """Fetch user from the db.

    Args:
        db: the related db session.
        user_id: the user id to fetch.

    Returns:
        the wanted user.
    """
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_username(
    db: Session,
    username: str
) -> User:
    """Get user from the db by username.

    Args:
        db: the related db session.
        username: the user's username.

    Returns:
        the wanted user.
    """
    return db.query(User).filter(User.username == username).first()


def get_subjects(
    db: Session,
    commander_id: int
) -> List[User]:
    """Get all subject of a given user.

    Args:
        db: the related db session.
        commander_id: the commander's id.

    Returns:
        list of subjects of the given commander.
    """
    commander = get_user(db, commander_id)
    return commander.soldiers


def get_reminder(
    db: Session,
    user_id: int
) -> time:
    """Get the reminder time of a given user.

    Args:
        db: the related db session.
        user_id: the related user.

    Returns:
        the reminder time of a given user.
    """
    user = get_user(db, user_id)
    return user.reminder_time


def was_reminded(
    db: Session,
    user_id: int
) -> bool:
    """Check if a user was reminded.

    Args:
        db: the related db session.
        user_id: the related user.

    Returns:
        if a user was reminded today.
    """
    user = get_user(db, user_id)
    return user.last_reminded_date >= date.today()
