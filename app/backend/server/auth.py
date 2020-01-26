"""Authentication module."""
import os
from datetime import datetime, timedelta
from typing import List

import jwt
from fastapi import (Depends, HTTPException, Security, APIRouter, Query)
from fastapi.security import (
    OAuth2PasswordBearer,
    OAuth2PasswordRequestForm,
    SecurityScopes,
)
from jwt import PyJWTError
from jwt.exceptions import ExpiredSignatureError
from sqlalchemy.orm import Session
# pylint: disable=no-name-in-module
from pydantic import BaseModel, ValidationError
from starlette.status import HTTP_401_UNAUTHORIZED

from db.schemas import User
from db.database import get_db, pwd_context
from db.crud import get_user_by_username, create_user

# TODO: remember in production to generate new hash using:
#       openssl rand -hex 32
SECRET_KEY = os.environ.get(
    "ONE_REPORT_SECRET",
    "a10519645263a665b3a10068a29b9e6171f32bad184d82a8aef0d790fe09d49a")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 500

router = APIRouter()


class Token(BaseModel):
    """Token model."""
    access_token: str
    token_type: str


class TokenData(BaseModel):
    """Token data model."""
    username: str = None
    scopes: List[str] = []


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/login",
    scopes={
        "personal": "main permissions.",
    },
)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify the given password with the hashed password."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Get the given password hash."""
    return pwd_context.hash(password)


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
        token_scopes = payload.get("scopes", [])
        token_data = TokenData(scopes=token_scopes, username=username)
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


@router.post("/login", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Login to system and get access token."""
    user = authenticate_user(db, form_data.username, form_data.password)

    if user is None:
        raise HTTPException(status_code=400,
                            detail="Incorrect username or password")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    # TODO: give only possible scopes
    access_token = create_access_token(
        data={"sub": user.username, "scopes": ["personal"]},
        expires_delta=access_token_expires,
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id
    }


@router.post("/register", response_model=User)
def register(
    *,
    username: str = Query(..., regex=r"^[A-Za-z0-9]+$"),
    password: str,
    db: Session = Depends(get_db)
) -> User:
    """Register to application and return the created user."""
    existing_user = get_user_by_username(db, username)
    if existing_user:
        raise HTTPException(status_code=400,
                            detail="Username already taken!")

    hashed_password = get_password_hash(password)
    created_user = create_user(db, username, hashed_password)

    return created_user
