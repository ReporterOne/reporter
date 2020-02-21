# pylint: disable=unused-argument
"""Madors api requests."""
from typing import List
from sqlalchemy.orm import Session
from fastapi import APIRouter, Security, Depends, HTTPException
from starlette.status import HTTP_400_BAD_REQUEST

from db import schemas, crud
from db.database import get_db
from server.auth.utils import get_current_user
from .security import get_relevant_madors, secure_user_mador_accessing

router = APIRouter()


@router.get("/")
async def get_all_madors(
    db: Session = Depends(get_db),
    current_user: schemas.User = Security(get_current_user,
                                          scopes=["personal"])
) -> List[schemas.Mador]:
    return get_relevant_madors(db, current_user)


@router.get("/{mador_name}/hierarchy")
async def get_mador_hierarchy(
    mador_name: str,
    db: Session = Depends(get_db),
    current_user: schemas.User = Security(get_current_user,
                                          scopes=["personal"])

) -> schemas.Hierarchy:
    with secure_user_mador_accessing(db, current_user, [mador_name]):
        mador = crud.madors.get_mador_by_name(db, name=mador_name)
        if mador.manager is None:
            return {
                "leader": None,
                "childs": []
            }

        return crud.users.get_hierarchy(db, leader_id=mador.manager.id)


def available_users(db, mador):
    return crud.users.get_users_without_mador(db) + mador.users


def extract_users_from_hierarchy(db, hierarchy):
    user_id = hierarchy.leader
    if user_id is None:
        return []

    user = crud.users.get_user(db, user_id)
    to_ret = [user]

    for child_hierarchy in hierarchy.childs:
        to_ret += extract_users_from_hierarchy(db, child_hierarchy)

    return to_ret


def get_users_from_id_list(db, ids):
    return [crud.users.get_user(db, user_id) for user_id in ids]


def check_wasnt_changed(db, mador, hierarchy, unassigned):
    previous_users = set(available_users(db, mador))
    new_users = set(extract_users_from_hierarchy(db, hierarchy) +
                    get_users_from_id_list(db, unassigned))

    if (len(new_users.difference(previous_users)) > 0 or
            len(previous_users.difference(new_users)) > 0):
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail="The state was changed before sending the request!"
        )


@router.put("/{mador_name}/hierarchy")
async def update_hierarchy(
    mador_name: str,
    hierarchy: schemas.Hierarchy,
    unassigned: List[int],
    db: Session = Depends(get_db),
    current_user: schemas.User = Security(get_current_user,
                                          scopes=["personal"])
) -> schemas.Hierarchy:
    with secure_user_mador_accessing(db, current_user, [mador_name]):
        mador = crud.madors.get_mador_by_name(db, name=mador_name)
        check_wasnt_changed(db, mador, hierarchy, unassigned)
        crud.madors.set_hierarchy(db, mador=mador, hierarchy=hierarchy,
                                  unassigned=unassigned)

        if mador.manager is None:
            return {
                "leader": None,
                "childs": []
            }

        return crud.users.get_hierarchy(db, leader_id=mador.manager.id)


@router.get("/{mador_name}/users")
async def get_mador_users(
    mador_name: str,
    db: Session = Depends(get_db),
    current_user: schemas.User = Security(get_current_user,
                                          scopes=["personal"])

) -> List[int]:
    with secure_user_mador_accessing(db, current_user, [mador_name]):
        mador = crud.madors.get_mador_by_name(db, name=mador_name)
        return [user.id for user in mador.users]


@router.get("/hierarchys")
async def get_hierarchys(
    db: Session = Depends(get_db),
    current_user: schemas.User = Security(get_current_user,
                                          scopes=["personal"])
):
    """Get hierarchys."""
    raise NotImplementedError  # TODO: implement.
