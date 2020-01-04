"""Permissions db model."""
from sqlalchemy import Integer, String, Column, ForeignKey, Table

from .models import Base

permission_map = Table('permissions_map', Base.metadata,
                       Column('permission_id', Integer,
                              ForeignKey('permissions.id', ondelete='CASCADE'),
                              index=True),
                       Column('user_id', Integer,
                              ForeignKey('users.id', ondelete='CASCADE'),
                              index=True)
                       )


class Permission(Base):
    """Permissions table for the application."""
    __tablename__ = 'permissions'
    id = Column(Integer, primary_key=True, unique=True)
    type = Column(String)
