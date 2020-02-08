# pylint: disable=unused-argument
"""Madors api requests."""
from typing import List
from sqlalchemy.orm import Session
from fastapi import APIRouter, Security, Depends

from db import schemas
from db.database import get_db
from server.auth.utils import get_current_user

router = APIRouter()


@router.get("/hierarchys", response_model=List[schemas.Hierarchy])
async def get_hierarchys(
    db: Session = Depends(get_db),
    current_user: schemas.User = Security(get_current_user,
                                          scopes=["personal"])
):
    """Get hierarchys."""
    raise NotImplementedError  # TODO: implement.
