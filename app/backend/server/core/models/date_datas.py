from datetime import date
from sqlalchemy.orm import relationship
from sqlalchemy import Integer, String, Column, ForeignKey, Date, Enum

from models import Base


class Reason(Base):
    __tablename__ = 'reasons'
    id = Column(Integer, primary_key=True, unique=True)
    reason = Column(String)


class DateDetails(Base):
    __tablename__ = 'date_details'
    id = Column(Integer, primary_key=True)
    date = Column(Date, unique=True, index=True)
    type = Column(Enum('required', 'not_required', 'not_important', name='date_type'), default='not_important')


class DateData(Base):
    __tablename__ = 'date_datas'
    id = Column(Integer, primary_key=True, unique=True)
    date = Column(Date, ForeignKey('date_details.date', ondelete='CASCADE'), default=date.today(), index=True)
    date_details = relationship('DateDetails', backref='datas')
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), index=True)
    user = relationship('User', backref='history')
    state = Column(Enum('here', 'not_here', name='answer_state'))
    reason = Column(Integer, ForeignKey('reasons.id'), index=True)
