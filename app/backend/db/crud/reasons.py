"""Reasons api with db."""
from typing import List
from sqlalchemy.orm import Session

from db.models import Reason


def get_reason_by_name(db: Session, reason: str) -> str:
    """Get reason object from name."""
    reason_to_return = db.query(Reason).filter(Reason.name == reason).first()
    if reason_to_return is None:
        raise AttributeError(f"Reason: {reason} does not exsists in the DB.")

    return reason_to_return


def get_reasons(db: Session) -> List[str]:
    """Get Reasons list from db.

    Args:
        db: the related db session.

    Returns:
        list of reasons.
    """
    return [reason.name for reason in db.query(Reason).all()]
