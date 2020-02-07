"""Authentication module."""
import os
from datetime import datetime, timedelta
from typing import List

import jwt
from google.oauth2 import id_token
from google.auth.transport import requests
from fastapi import (Depends, HTTPException, Security, APIRouter, Body)
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

from db import schemas
from db.schemas import User
from db.database import get_db, get_password_hash, verify_password
from db.crud import get_user_by_username, create_user

# TODO: remember in production to generate new hash using:
#       openssl rand -hex 32
SECRET_KEY = os.environ.get(
    "ONE_REPORT_SECRET",
    "a10519645263a665b3a10068a29b9e6171f32bad184d82a8aef0d790fe09d49a")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 500
CLIENT_ID = "623244279739-lrqk7n917mpnuqbmnkgbv8l4o73tjiek.apps.googleusercontent.com"

router = APIRouter()


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


def authenticate_google_user(token):
    try:
        # Specify the CLIENT_ID of the app that accesses the backend:
        idinfo = id_token.verify_oauth2_token(token, requests.Request(),
                                              CLIENT_ID)

        # Or, if multiple clients access the backend server:
        # idinfo = id_token.verify_oauth2_token(token, requests.Request())
        # if idinfo['aud'] not in [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]:
        #     raise ValueError('Could not verify audience.')

        if idinfo['iss'] not in ['accounts.google.com',
                                 'https://accounts.google.com']:
            raise HTTPException(
                status_code=HTTP_401_UNAUTHORIZED,
                detail="Wrong token issuer!",
            )
            raise ValueError('Wrong issuer.')

        # If auth request is from a G Suite domain:
        # if idinfo['hd'] != GSUITE_DOMAIN_NAME:
        #     raise ValueError('Wrong hosted domain.')

        # ID token is valid. Get the user's Google Account ID from the
        # decoded token.
        return idinfo["sub"]

    except ValueError:
        # Invalid token
        raise HTTPException(
            status_code=HTTP_401_UNAUTHORIZED,
            detail="invalid token!",
        )


@router.post("/login/google", response_model=Token)
async def login_using_google(
    body: schemas.GoogleToken = Body(...),
    db: Session = Depends(get_db)
):
    """Login to system using google access token."""
    username = authenticate_google_user(body.google_token)
    user = get_user_by_username(db, username)

    if user is None:
        raise HTTPException(status_code=400,
                            detail="User isn't registered yet!")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    # TODO: give only possible scopes
    access_token = create_access_token(
        data={"sub": user.username, "id": user.id, "scopes": ["personal"]},
        expires_delta=access_token_expires,
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id
    }


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
        data={"sub": user.username, "id": user.id, "scopes": ["personal"]},
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
    username: str,
    password: str,
    email: str,
    db: Session = Depends(get_db)
) -> User:
    """Register to application and return the created user."""
    existing_user = get_user_by_username(db, username)
    if existing_user:
        raise HTTPException(status_code=400,
                            detail="Username already taken!")

    hashed_password = get_password_hash(password)
    created_user = create_user(db, username,
                               password=hashed_password, email=email)

    return created_user


@router.post("/register/google", response_model=User)
def register(
    *,
    body: schemas.GoogleToken = Body(...),
    db: Session = Depends(get_db)
) -> User:
    """Register to application and return the created user."""
    username = authenticate_google_user(body.google_token)
    existing_user = get_user_by_username(db, username)
    if existing_user:
        raise HTTPException(status_code=400,
                            detail="Username already taken!")

    created_user = create_user(db, username, account_type='google')

    return created_user


