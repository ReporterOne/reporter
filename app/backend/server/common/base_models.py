from enum import Enum 
from typing import List, Dict, Any
from datetime import date, time

from pydantic import BaseModel


class Mador(BaseModel):
    name: str
    manager: int = None


class StatusTypes(str, Enum):
    required = "required"
    not_required = "not_required"
    not_important = "not_important"


class GetDate(BaseModel):
    date: date
    reason: str = None
    type: StatusTypes
    users_id: int


class DatesResponce(BaseModel):
    dates_list: List[GetDate]


class PostDates(BaseModel):
    start_date: date
    end_date: date = None
    reason: str = None
    type: StatusTypes = None
    users_id: List[int] = []


class User(BaseModel):
    id: int
    commander: int = None
    reminder_time: time = None
    english_name: str = None
    mador: Mador = None
    operates: List[int] = None

class Hierarchy(BaseModel):
    """"Hierarchy for User and Commander."""
    hierarchy: Dict[User, Any] = None

class HierarchyList(BaseModel):
    """Hierarchy for Reporter and Admin 
        that can view more then 1 hierarchy.
    """
    hierarchys: List[Hierarchy]
