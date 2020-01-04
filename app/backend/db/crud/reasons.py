"""Reasons api with db."""
from typing import List

from sqlalchemy.orm import Session

from db.models import Reason


def get_reasons(db: Session) -> List[Reason]:
    """Get Reasons list from db.

    Args:
        db: the related db session.

    Returns:
        list of reasons.
    """
    return [reason.name for reason in db.query(Reason).all()]
