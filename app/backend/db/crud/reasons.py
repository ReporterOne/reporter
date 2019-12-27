from sqlalchemy.orm import Session
from datetime import date, time
from typing import List

from db.models import Reason


def get_reasons(db: Session):
    return [reason.name for reason in db.query(Reason).all()]
