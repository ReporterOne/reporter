from typing import List
from datetime import date
from sqlalchemy.orm import Session
from fastapi import APIRouter, Query, Depends, Security

from server.auth import get_current_user

from db import crud
from db import schemas
from db.database import get_db

router = APIRouter()


@router.get("/me", response_model=schemas.User)
async def get_current_user(
    current_user: schemas.User = Security(get_current_user,
                                          scopes=["personal"])
):
    return current_user
