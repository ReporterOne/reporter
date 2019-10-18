from sqlalchemy import Enum, String, Column

from models import Base


class Settings(Base):
    """Settings table for the application."""
    __tablename__ = 'settings'
    key = Column(String)
    value = Column(String)
    type = Column(Enum("int", "str", "bool", "time", "date"))

    def __repr__(self):
        return (f"<Settings(key={self.key}, "
                f"value={self.value}, type={self.type})>")
