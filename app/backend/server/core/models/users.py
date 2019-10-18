from sqlalchemy import Integer, String, Column, ForeignKey, Date, Enum

from models import Base


class Mador(Base):
    manager = Column(Integer, ForeignKey('users.id'), unique=True)
    name = Column(String, primary_key=True, unique=True)


class User(Base):
    """Permissions table for the application."""
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, unique=True)
    commander = Column(Integer, ForeignKey('users.id'), index=True)
    reminder_time = Column(String)
    last_reminded_date = Column(Date)
    english_name = Column(String)
    type = Column(Enum('facebook', 'google', 'local'))
    username = Column(String, index=True, unique=True)
    password = Column(String)
    mador = Column(String, ForeignKey('mador.name'), index=True)
    operates = Column(String, ForeignKey('mador.name'), index=True)
