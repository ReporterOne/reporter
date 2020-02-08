"""Authentication module."""
from datetime import timedelta

from fastapi import (Depends, HTTPException, APIRouter)
from fastapi.security import (
    OAuth2PasswordRequestForm,
)
from sqlalchemy.orm import Session
# pylint: disable=no-name-in-module

from db.schemas import User
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
