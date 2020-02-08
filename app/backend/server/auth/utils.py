from datetime import timedelta, datetime
from typing import List

import jwt
from fastapi import Depends, HTTPException, Security
from fastapi.security import OAuth2PasswordBearer, SecurityScopes
from jwt import ExpiredSignatureError, PyJWTError
from pydantic import BaseModel, ValidationError
from sqlalchemy.orm import Session
from starlette.status import HTTP_401_UNAUTHORIZED

from db.crud import get_user_by_username
from db.database import verify_password, get_db
from db.schemas import User
from .consts import SECRET_KEY, ALGORITHM



class Token(BaseModel):
    """Token model."""
    access_token: str
    token_type: str


class TokenData(BaseModel):
    """Token data model."""
    username: str = None
    user_id: int = None
    scopes: List[str] = []


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/login",
    scopes={
        "personal": "main permissions.",
    },
)


def authenticate_user(db: Session, username: str, password: str) -> User:
    """Authenticate the user and return it from the db."""
    user = get_user_by_username(db, username)
    if not user:
        return None
    if not verify_password(password, user.password):
        return None
    return user


def create_access_token(*, data: dict, expires_delta: timedelta = None) -> str:
    """Create an access token and return the encoding of it."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(
    security_scopes: SecurityScopes,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """Get the current user from the given token."""
    if security_scopes.scopes:
        authenticate_value = f'Bearer scope="{security_scopes.scope_str}"'
    else:
        authenticate_value = f"Bearer"

    credentials_exception = HTTPException(
        status_code=HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": authenticate_value},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        user_id: int = payload.get("id")
        if user_id is None:
            raise credentials_exception
        token_scopes = payload.get("scopes", [])
        token_data = TokenData(scopes=token_scopes, username=username,
                               user_id=user_id)
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=HTTP_401_UNAUTHORIZED,
            detail="Token is expired",
            headers={"WWW-Authenticate": authenticate_value},
        )

    except (PyJWTError, ValidationError):
        raise credentials_exception

    user = get_user_by_username(db, username=token_data.username)
    if user is None:
        raise credentials_exception
    for scope in security_scopes.scopes:
        if scope not in token_data.scopes:
            raise HTTPException(
                status_code=HTTP_401_UNAUTHORIZED,
                detail="Not enough permissions",
                headers={"WWW-Authenticate": authenticate_value},
            )
    return user


async def get_current_user_secured(
    current_user: User = Security(get_current_user, scopes=["personal"])
) -> User:
    """Get the current user with secured scope."""
    return current_user
