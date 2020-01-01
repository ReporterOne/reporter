from sqlalchemy.orm import relationship
from sqlalchemy import Integer, String, Column, ForeignKey, Date, Enum, DateTime, Boolean

from .models import Base


class Reason(Base):
    __tablename__ = 'reasons'

    NOT_HERE = 'not_here'
    HERE = 'here'

    id = Column(Integer, primary_key=True, unique=True)
    name = Column(String)


class DateDetails(Base):
    __tablename__ = 'date_details'

    REQUIRED = 'required'
    NOT_REQUIRED = 'not_required'
    UNKNOWN = 'unknown'

    id = Column(Integer, primary_key=True)
    date = Column(Date, unique=True, index=True)
    type = Column(Enum(REQUIRED, NOT_REQUIRED, UNKNOWN, name='date_type'), default=UNKNOWN)


class DateData(Base):
    __tablename__ = 'date_datas'
    id = Column(Integer, primary_key=True, unique=True)
    date = Column(Date, ForeignKey('date_details.date', ondelete='CASCADE'), index=True)
    date_details = relationship('DateDetails', backref='datas')
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), index=True)
    user = relationship('User', backref='statuses', foreign_keys=[user_id])
    state = Column(Enum(Reason.HERE, Reason.NOT_HERE, name='answer_state'))
    reason_id = Column(Integer, ForeignKey('reasons.id'), index=True)
    reason = relationship('Reason', backref='date_datas', foreign_keys=[reason_id])
    reported_by_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), index=True)
    reported_by = relationship('User', backref='reports_history',
                               foreign_keys=[reported_by_id])
    reported_time = Column(DateTime)



class RepetativeData(Base):
    __tablename__ = 'repetative_datas'
    id = Column(Integer, primary_key=True, unique=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), index=True)
    user = relationship('User', backref='repetative_statuses', foreign_keys=[user_id])

    from_date_id = Column(Integer, ForeignKey('date_details.id', ondelete='CASCADE'), index=True)
    from_date = relationship('DateDetails', foreign_keys=[from_date_id])

    to_date_id = Column(Integer, ForeignKey('date_details.id', ondelete='CASCADE'), index=True)
    to_date = relationship('DateDetails', foreign_keys=[to_date_id])

    every = Column(Integer)  # bitmask of the week days 1001000 is every sunday and wednesday

    reason_id = Column(Integer, ForeignKey('reasons.id'), index=True)
    reason = relationship('Reason', backref='repetative_datas', foreign_keys=[reason_id])
    reported_time = Column(DateTime)
    is_active = Column(Boolean)
