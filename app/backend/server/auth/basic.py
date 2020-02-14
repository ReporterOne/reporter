"""Authentication module."""
from datetime import timedelta

from fastapi import (Depends, HTTPException, APIRouter, Body)
from fastapi.security import (
    OAuth2PasswordRequestForm,
)
from sqlalchemy.orm import Session
# pylint: disable=no-name-in-module

from db import schemas, crud
from db.database import get_db, get_password_hash
from db.crud import get_user_by_username, create_user
from .utils import (Token,
                    authenticate_user,
                    create_access_token)
from .consts import ACCESS_TOKEN_EXPIRE_MINUTES


router = APIRouter()


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


@router.post("/register", response_model=schemas.User)
def register(
    *,
    body: schemas.RegisterForm = Body(...),
    db: Session = Depends(get_db)
):
    """register to application and return the created user."""
    existing_user = get_user_by_username(db, body.username)
    if existing_user:
        raise HTTPException(status_code=400,
                            detail="username already taken!")

    hashed_password = get_password_hash(body.password)
    created_user = create_user(db,
                               username=body.username,
                               password=hashed_password,
                               icon_path=body.avatar,
                               english_name=body.name,
                               email=body.email)

    return created_user


@router.post("/is_free")
def is_user_free(
    *,
    body: schemas.IsUserFree,
    db: Session = Depends(get_db)
):
    """register to application and return the created user."""
    if body.type not in ['local', 'facebook', 'google']:
        raise HTTPException(status_code=400,
                            detail=f"invalid type given '{body.type}'")

    if body.type == 'local':
        existing_user = crud.users.get_user_by_username(db, body.value)

    elif body.type == 'facebook':
        existing_user = crud.users.get_user_by_facebook_id(db, body.value)

    elif body.type == 'google':
        existing_user = crud.users.get_user_by_google_id(db, body.value)

    if existing_user:
        raise HTTPException(status_code=400,
                            detail="username already taken!")
