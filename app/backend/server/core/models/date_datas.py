from datetime import date
from sqlalchemy import Integer, String, Column, ForeignKey, Date, Enum

from models import Base


class Reason(Base):
    __tablename__ = 'reasons'
    id = Column(Integer, primary_key=True, unique=True)
    reason = Column(String)


class DateDetails(Base):
    __tablename__ = 'date_details'
    date = Column(Date, primary_key=True, unique=True)
    type = Column(Enum('required', 'not_required', 'not_important'), default='not_important')


class DateData(Base):
    __tablename__ = 'date_datas'
    id = Column(Integer, primary_key=True, unique=True)
    date = Column(Date, ForeignKey('date_details.date'), default=date.today())
    user = Column(Integer, ForeignKey('users.id'))
    state = Column(Enum('here', 'not_here'))
    reason = Column(Integer, ForeignKey('reasons.id'))
