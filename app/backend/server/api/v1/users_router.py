from typing import List
from datetime import date
from sqlalchemy.orm import Session
from fastapi import APIRouter, Query, Depends, Security

from server import auth

from db import crud
from db import schemas
from db.database import get_db

router = APIRouter()


@router.get("/", response_model=List[schemas.User])
async def get_users(
    users_id: List[int] = Query([]),
    db: Session = Depends(get_db),
    current_user: schemas.User = Security(auth.get_current_user,
                                          scopes=["personal"])
):
    if len(users_id) == 0:
        return crud.get_subjects(
                db=db, 
                commander_id=current_user
            )

    return crud.get_users(
            db=db, 
            users_id=users_id
        )

@router.post("/", response_model=List[schemas.User])
async def post_users(
    users_id: List[int] = Query([]),
    db: Session = Depends(get_db),
    current_user: schemas.User = Security(auth.get_current_user,
                                          scopes=["personal"])
):
    if len(users_id) == 0:
        


@router.get("/me", response_model=schemas.User)
async def get_current_user(
    current_user: schemas.User = Security(auth.get_current_user,
                                          scopes=["personal"])
):
    return current_user
