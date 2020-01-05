"""Settings model in db."""
from sqlalchemy.orm import relationship, backref
from sqlalchemy import Enum, String, Column, Integer, ForeignKey

from .models import Base


class Settings(Base):
    """Settings table for the application."""
    __tablename__ = 'settings'
    id = Column(Integer, primary_key=True)
    key = Column(String)
    value = Column(String)
    type = Column(Enum("int", "str", "bool", "time", "date", name='types'),
                  default="str", nullable=False)

    def __repr__(self):
        return (f"<Settings(key={self.key}, "
                f"value={self.value}, type={self.type})>")


class MadorSettings(Base):
    """Mador Settings table for the application."""
    __tablename__ = 'mador_settings'
    id = Column(Integer, primary_key=True)
    mador_name = Column(String, ForeignKey('madors.name', ondelete='CASCADE'),
                        index=True)
    mador = relationship('Mador', backref=backref('settings', uselist=False))
    key = Column(String)
    value = Column(String)
    type = Column(Enum("int", "str", "bool", "time", "date", name='types'),
                  default="str", nullable=False)

    def __repr__(self):
        return (f"<Mador {self.mador} Settings(key={self.key}, "
                f"value={self.value}, type={self.type})>")
