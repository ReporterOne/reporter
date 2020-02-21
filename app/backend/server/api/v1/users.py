# pylint: disable=unused-argument
"""Users api requests."""
from typing import List, Dict
from datetime import date, datetime

from fastapi import APIRouter, Depends, Security, Body, HTTPException
from sqlalchemy.orm import Session
from starlette.status import HTTP_400_BAD_REQUEST

from .security import (get_all_allowed_users_of,
                       secure_user_accessing, secure_access_unassigned_users)
from server.auth.utils import get_current_user

from db import crud
from db import schemas
from db.database import get_db, get_password_hash
from .dates_data import get_calendar_of_users

router = APIRouter()


@router.get("/unassigned")
async def get_unassigned_users(
    current_user: schemas.User = Security(get_current_user,
                                          scopes=["personal"]),
    db: Session = Depends(get_db),
):
    with secure_access_unassigned_users(db, current_user):
        return [user.id for user in crud.users.get_users_without_mador(db)]


@router.get("/me", response_model=schemas.User)
async def get_me_user(
    current_user: schemas.User = Security(get_current_user,
                                          scopes=["personal"]),

):
    """Get current user."""
    return current_user


@router.put("/me")
async def update_current_user(
    body: schemas.UpdateUserDetails,
    current_user: schemas.User = Security(get_current_user,
                                          scopes=["personal"]),
    db: Session = Depends(get_db),
):
    if body.id != current_user.id:
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail="Given user id isn't current user."
        )

    changeable = ["english_name", "icon_path", "password", "reminder_time"]
    for want_to_change in body.to_change:
        if want_to_change not in changeable:
            raise HTTPException(
                status_code=HTTP_400_BAD_REQUEST,
                detail=f"Can't change field '{want_to_change}'"
            )

    if "password" in body.to_change:
        body.to_change["password"] = get_password_hash(
            body.to_change["password"])

    return crud.users.update_user(db, user=current_user,
                                  **body.to_change)


@router.get("/me/allowed_users", response_model=List[schemas.User])
async def get_allowed_users(
    current_user: schemas.User = Security(get_current_user,
                                          scopes=["personal"]),
    db: Session = Depends(get_db),
):
    """Get current user."""
    return get_all_allowed_users_of(db, current_user)


@router.get("/me/subjects", response_model=List[int])
async def get_my_subjects(
    db: Session = Depends(get_db),
    current_user: schemas.User = Security(get_current_user,
                                          scopes=["personal"])
):
    """Get subjects."""
    return [user.id for user in crud.users.get_subjects(
        db=db,
        commander_id=current_user.id
    )]


@router.get("/me/statuses",
            response_model=List[schemas.CalendarResponse])
async def get_calendar_me(
    start: date,
    end: date = None,
    db: Session = Depends(get_db),
    current_user: schemas.User = Security(get_current_user,
                                          scopes=["personal"])
):
    """Get calendar data of user."""
    user_id = current_user.id
    return get_calendar_of_users(users_id=[user_id],
                                 start=start, end=end, db=db)


@router.post("/me/statuses",
             response_model=Dict[date, schemas.DateDataResponse])
async def post_calendar_me(
    start: date = Body(...),
    end: date = Body(None),
    state: schemas.AnswerStateTypes = Body(...),
    reason: str = Body(None),
    db: Session = Depends(get_db),
    current_user: schemas.User = Security(get_current_user,
                                          scopes=["personal"])
):
    """Get calendar data of user."""
    user_id = current_user.id
    return post_calendar_of_user(user_id=user_id, start=start, end=end,
                                 reason=reason, state=state,
                                 db=db, current_user=current_user)


@router.get("/{user_id}", response_model=schemas.User)
async def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Security(get_current_user,
                                          scopes=["personal"])
):
    """Get user."""
    with secure_user_accessing(db, current_user, [user_id]):
        return crud.users.get_user(
            db=db,
            user_id=user_id
        )


@router.delete("/{user_id}")
async def delete_user(
    user_id: int = None,
    db: Session = Depends(get_db),
    current_user: schemas.User = Security(get_current_user,
                                          scopes=["personal"])
):
    """Delete user."""
    with secure_user_accessing(db, current_user, [user_id]):
        crud.users.delete_user(db=db, user_id=user_id)


@router.get("/{user_id}/commander_id")
async def get_commander(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Security(get_current_user,
                                          scopes=["personal"])
) -> int:
    """Get commander."""
    with secure_user_accessing(db, current_user, [user_id]):
        return crud.users.get_commander_id(db=db, user_id=user_id)


@router.get("/{user_id}/subjects", response_model=List[int])
async def get_subjects(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Security(get_current_user,
                                          scopes=["personal"])
):
    """Get subjects."""
    with secure_user_accessing(db, current_user, [user_id]):
        return [user.id for user in crud.users.get_subjects(
            db=db,
            commander_id=user_id
        )]


def post_calendar_of_user(db, user_id, start, end, state, reason,
                          current_user):
    response = crud.date_datas.set_new_date_data(
        db=db,
        user_id=user_id,
        start_date=start,
        end_date=end,
        state=state,
        reason=reason,
        reported_by_id=current_user.id,
        reported_time=datetime.now()
    )
    return response


@router.get("/{user_id}/statuses",
            response_model=List[schemas.CalendarResponse])
async def get_calendar(
    user_id: int,
    start: date,
    end: date = None,
    db: Session = Depends(get_db),
    current_user: schemas.User = Security(get_current_user,
                                          scopes=["personal"])
):
    """Get calendar data of user."""
    with secure_user_accessing(db, current_user, [user_id]):
        return get_calendar_of_users(users_id=[user_id],
                                     start=start, end=end, db=db)


@router.post("/{user_id}/statuses",
             response_model=Dict[date, schemas.DateDataResponse])
async def post_user_calendar(
    user_id: int,
    start: date = Body(...),
    end: date = Body(None),
    state: schemas.AnswerStateTypes = Body(...),
    reason: str = Body(None),
    db: Session = Depends(get_db),
    current_user: schemas.User = Security(get_current_user,
                                          scopes=["personal"])
):
    """Get calendar data of user."""
    with secure_user_accessing(db, current_user, [user_id]):
        return post_calendar_of_user(user_id=user_id, start=start, end=end,
                                     reason=reason, state=state,
                                     db=db, current_user=current_user)
