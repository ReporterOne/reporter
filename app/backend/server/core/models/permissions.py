from sqlalchemy import Integer, String, Column, ForeignKey

from models import Base


class Permission(Base):
    """Permissions table for the application."""
    __tablename__ = 'permissions'
    id = Column(Integer, primary_key=True, unique=True)
    type = Column(String)


class PermissionScheme(Base):
    """Permissions scheme for the application."""
    __tablename__ = 'permission_scheme'
    permission = Column(Integer, ForeignKey('permissions.id'), index=True)
    user = Column(Integer, ForeignKey('users.id'), index=True)
