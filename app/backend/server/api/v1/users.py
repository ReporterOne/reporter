# pylint: disable=unused-argument
"""Users api requests."""
from typing import List
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, Security

from server import auth

from db import crud
from db import schemas
from db.database import get_db

router = APIRouter()


@router.get("/{user_id}", response_model=schemas.User)
async def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Security(auth.get_current_user,
                                          scopes=["personal"])
):
    return crud.get_user(
            db=db,
            user_id=user_id
        )


@router.delete("/{user_id}")
async def delete_user(
    user_id: int = None,
    db: Session = Depends(get_db),
    current_user: schemas.User = Security(auth.get_current_user,
                                          scopes=["personal"])
):
    crud.delete_user(db=db, user_id=user_id)


@router.get("/{user_id}/commander_id")
async def get_commander(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Security(auth.get_current_user,
                                          scopes=["personal"])
) -> int:
    return crud.get_commander_id(db=db, user_id=user_id)


@router.get("/{user_id}/subjects", response_model=List[schemas.User])
async def get_subjects(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Security(auth.get_current_user,
                                          scopes=["personal"])
):
    return crud.get_subjects(
            db=db,
            commander_id=user_id
        )


@router.get("/me", response_model=schemas.User)
async def get_current_user(
    current_user: schemas.User = Security(auth.get_current_user,
                                          scopes=["personal"])
):
    return current_user
