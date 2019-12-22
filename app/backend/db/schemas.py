from enum import Enum 
from typing import List, Dict, Any
from datetime import date, time

from pydantic import BaseModel


class Mador(BaseModel):
    name: str
    manager: int = None

    class Config:
        orm_mode = True


class User(BaseModel):
    id: int
    commander: int = None
    reminder_time: time = None
    english_name: str = None
    mador: Mador = None
    operators_id: List[int] = None

    class Config:
        orm_mode = True


class Hierarchy(BaseModel):
    """"Hierarchy for User and Commander."""
    hierarchy: Dict[User, Any] = None


class HierarchyList(BaseModel):
    """Hierarchy for Reporter and Admin 
        that can view more then 1 hierarchy.
    """
    hierarchys: List[Hierarchy]


class StatusTypes(str, Enum):
    required = "required"
    not_required = "not_required"
    not_important = "not_important"


class DateDetails(BaseModel):
    date: date
    type: StatusTypes = None


class AnswerStateTypes(str, Enum):
    here = "here"
    not_here = "not_here"


class DateData(BaseModel):
    user: User 
    start_date: date
    end_date: date = None
    state: AnswerStateTypes
    reported_by: User = None
    reason: str = None
    date_details: DateDetails

    class Config:
        orm_mode = True


class DateResponce(BaseModel):
    user_id: int
    data: List[DateData]

    class Config:
        orm_mode = True


class MultipleUsersDatesResponce(BaseModel):
    data: List[DateResponce]