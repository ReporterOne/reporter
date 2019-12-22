from sqlalchemy.orm import relationship
from sqlalchemy import Integer, String, Column, ForeignKey, Date, Enum

from .models import Base


class Reason(Base):
    __tablename__ = 'reasons'
    id = Column(Integer, primary_key=True, unique=True)
    name = Column(String)


class DateDetails(Base):
    __tablename__ = 'date_details'
    id = Column(Integer, primary_key=True)
    date = Column(Date, unique=True, index=True)
    type = Column(Enum('required', 'not_required', 'not_important', name='date_type'), default='not_important')


class DateData(Base):
    __tablename__ = 'date_datas'
    id = Column(Integer, primary_key=True, unique=True)
    date = Column(Date, ForeignKey('date_details.date', ondelete='CASCADE'), index=True)
    date_details = relationship('DateDetails', backref='datas')
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), index=True)
    user = relationship('User', backref='statuses')
    state = Column(Enum('here', 'not_here', name='answer_state'))
    reason_id = Column(Integer, ForeignKey('reasons.id'), index=True)
    reason = relationship('Reason', backref='date_datas')
    reported_by_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), index=True)
    reported_by = relationship('User', backref='reports_history')

    def __eq__(self, other):
        return (self.date_details == other.date_details
            and self.user_id == other.user_id
            and self.state == other.state
            and self.reason_id == other.reason_id
            and self.reported_by_id == other.reported_by_id)


class RepetativeData(Base):
    __tablename__ = 'repetative_datas'
    id = Column(Integer, primary_key=True, unique=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), index=True)
    user = relationship('User', backref='repetative_statuses')

    from_date_id = Column(Integer, ForeignKey('date_details.id', ondelete='CASCADE'), index=True)
    from_date = relationship('DateDetails')

    to_date_id = Column(Integer, ForeignKey('date_details.id', ondelete='CASCADE'), index=True)
    to_date = relationship('DateDetails')

    every = Column(Integer)  # bitmask of the week days 1001000 is every sunday and wednesday

    reason_id = Column(Integer, ForeignKey('reasons.id'), index=True)
    reason = relationship('Reason', backref='date_datas')
