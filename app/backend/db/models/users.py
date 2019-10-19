from sqlalchemy.dialects.postgresql import TIME
from sqlalchemy.orm import relationship, backref
from sqlalchemy import Integer, String, Column, ForeignKey, Date, Enum, select

from .models import Base
from .settings import MadorSettings
from .permissions import permission_map


class Mador(Base):
    __tablename__ = 'madors'
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True)


class User(Base):
    """Permissions table for the application."""
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, unique=True)
    commander_id = Column(Integer, ForeignKey('users.id', ondelete='SET NULL'), index=True)
    soldiers = relationship('User', backref=backref('commander', remote_side=[id]))
    reminder_time = Column(TIME)
    last_reminded_date = Column(Date)
    english_name = Column(String)
    type = Column(Enum('facebook', 'google', 'local', name='user_type'), default='local')
    username = Column(String, index=True, unique=True)
    password = Column(String)
    mador_name = Column(String, ForeignKey('madors.name', ondelete='SET NULL'), index=True) 
    mador = relationship('Mador', backref='users', foreign_keys=[mador_name])
    operates_mador_name = Column(String, ForeignKey('madors.name', ondelete='SET NULL'), index=True)
    operates_mador = relationship('Mador', backref=backref('operator', uselist=False), foreign_keys=[operates_mador_name])
    manages_mador_name = Column(String, ForeignKey('madors.name', ondelete='SET NULL'), unique=True)
    manages_mador = relationship('Mador', backref=backref('manager', uselist=False), foreign_keys=[manages_mador_name])
    permissions = relationship('Permission', secondary=permission_map, backref='users')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        mador_name = self.mador.name if self.mador else self.mador_name

        if mador_name:
            self.reminder_time = select([MadorSettings.value]).where(
                mador_name == MadorSettings.mador_name and MadorSettings.key == 'default_reminder_time'
            )
