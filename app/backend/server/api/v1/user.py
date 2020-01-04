"""Users api requests."""
from fastapi import APIRouter, Security

from server.auth import get_current_user

from db import schemas

router = APIRouter()


@router.get("/me", response_model=schemas.User)
async def get_user_me(
    current_user: schemas.User = Security(get_current_user,
                                          scopes=["personal"])
):
    """Get the current user."""
    return current_user
