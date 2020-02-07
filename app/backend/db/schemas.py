# pylint: disable=missing-class-docstring
"""Schemes for db responses."""
from enum import Enum
from typing import List, Any
from datetime import date, time, datetime

from pydantic import BaseModel  # pylint: disable=no-name-in-module


class Mador(BaseModel):
    name: str

    class Config:
        orm_mode = True


class User(BaseModel):
    id: int
    commander_id: int = None
    reminder_time: time = None
    english_name: str = None
    mador: Mador = None
    manages_mador_name: str = None
    operates: List[Mador] = None
    icon_path: str = None

    class Config:
        orm_mode = True


class UserAuth(User):
    username: str
    password: str


class Hierarchy(BaseModel):
    """"Hierarchy for User and Commander."""
    leader_id: int
    childs: List[Any]  # list of Hierarchy.


class StatusTypes(str, Enum):
    required = "required"
    not_required = "not_required"
    not_important = "not_important"


class DateDetails(BaseModel):
    date: date
    type: str = None
    # TODO: when [BUG] SQLAlchemy Exception
    # when using Enums and jsonable_encoder
    # will be solved, puth the type to be StatusTypes

    class Config:
        orm_mode = True


class AnswerStateTypes(str, Enum):
    here = "here"
    not_here = "not_here"


class PostDateDataBody(BaseModel):
    user_id: int
    start_date: date
    end_date: date = None
    state: AnswerStateTypes
    reason: str = None

    class Config:
        orm_mode = True


class PutDateDataBody(BaseModel):
    user_id: int
    start_date: date
    end_date: date = None
    state: AnswerStateTypes = None
    reason: str = None

    class Config:
        orm_mode = True


class ReasonData(BaseModel):
    name: str

    class Config:
        orm_mode = True


class DateDataResponse(BaseModel):
    user_id: int
    state: AnswerStateTypes = None
    reason: ReasonData = None
    reported_by_id: int = None
    reported_time: datetime = None
    date_details: DateDetails

    class Config:
        orm_mode = True


class RangeDatesResponse(BaseModel):
    user_id: int
    data: List[DateDataResponse]

    class Config:
        orm_mode = True


class CalendarResponse(BaseModel):
    date: date
    type: str
    data: List[DateDataResponse]

    class Config:
        orm_mode = True
