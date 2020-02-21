# pylint: disable=missing-class-docstring
"""Schemes for db responses."""
from enum import Enum
from typing import List, ForwardRef, Optional
from datetime import date, time, datetime

from pydantic import BaseModel  # pylint: disable=no-name-in-module


class Mador(BaseModel):
    name: str

    class Config:
        orm_mode = True


class Permission(BaseModel):
    type: str

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
    permissions: List[Permission] = None
    icon_path: str = None

    class Config:
        orm_mode = True


class UserAuth(User):
    username: str
    password: str


Hierarchy = ForwardRef('Hierarchy')


class Hierarchy(BaseModel):
    """"Hierarchy for User and Commander."""
    leader: Optional[int]
    childs: List[Hierarchy]  # list of Hierarchy.


Hierarchy.update_forward_refs()


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


class GoogleToken(BaseModel):
    google_token: str


class FacebookToken(BaseModel):
    facebook_token: str


class GoogleRegister(BaseModel):
    google_token: str
    email: str
    name: str
    avatar: str


class FacebookRegister(BaseModel):
    facebook_token: str
    email: str
    name: str
    avatar: str


class RegisterForm(BaseModel):
    username: str
    password: str
    email: str
    name: str
    avatar: str


class UpdateUserDetails(BaseModel):
    id: int
    to_change: dict = {}

    class Config:
        orm_mode = True


class IsUserFree(BaseModel):
    type: str
    value: str

    class Config:
        orm_mode = True
