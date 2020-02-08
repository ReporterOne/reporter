from datetime import timedelta

from fastapi import HTTPException, Body, Depends, APIRouter
from sqlalchemy.orm import Session
from starlette.status import HTTP_401_UNAUTHORIZED
from google.oauth2 import id_token
from google.auth.transport import requests

from db import schemas, crud
from db.crud import create_user
from db.database import get_db
from db.schemas import User
from .utils import (Token,
                    create_access_token)
from .consts import ACCESS_TOKEN_EXPIRE_MINUTES, CLIENT_ID


router = APIRouter()


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
    user = crud.users.get_user_by_google_id(db, google_id=username)

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


@router.post("/register/google", response_model=User)
def register_google(
    *,
    body: schemas.GoogleToken = Body(...),
    db: Session = Depends(get_db)
) -> User:
    """Register to application and return the created user."""
    username = authenticate_google_user(body.google_token)
    existing_user = crud.users.get_user_by_google_id(db, google_id=username)
    if existing_user:
        raise HTTPException(status_code=400,
                            detail="Username already taken!")

    created_user = create_user(db, username, google_id=username,
                               account_type='google')

    return created_user
