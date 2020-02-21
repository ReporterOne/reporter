from typing import List

from sqlalchemy.orm import Session

from db import schemas
from .users import remove_permission, add_permission
from db.models import User, Mador


def get_all_madors(db: Session) -> List[Mador]:
    return db.query(Mador).all()


def get_mador_by_name(db: Session, name: str) -> Mador:
    return db.query(Mador).filter(Mador.name == name).first()


def set_hierarchy_recursive(
    db: Session,
    mador: Mador,
    hierarchy: schemas.Hierarchy
) -> List[User]:
    user_id = hierarchy.leader
    if user_id is None:
        return []

    user = db.query(User).filter(User.id == user_id).one()
    users = [user]
    soldiers = []
    if len(hierarchy.childs) > 0:
        add_permission(db, user, 'commander')

    for child_hierarchy in hierarchy.childs:
        child = db.query(User).filter(User.id == child_hierarchy.leader).one()
        soldiers.append(child)
        users += set_hierarchy_recursive(db, mador, child_hierarchy)

    user.soldiers = soldiers
    return users


def set_hierarchy(
    db: Session,
    mador: Mador,
    hierarchy: schemas.Hierarchy,
    unassigned: List[int]
):
    for user_id in unassigned:
        user = db.query(User).filter(User.id == user_id).one()
        user.mador = None
        user.manages_mador = None
        user.commander_id = None
        remove_permission(db, user, 'commander')

    users = set_hierarchy_recursive(db, mador, hierarchy)
    mador.users = users
    if mador.manager:
        mador.manager.manages_mador = None
    db.commit()

    user_id = hierarchy.leader
    if user_id is not None:
        user = db.query(User).filter(User.id == user_id).one()
        mador.manager = user
        db.commit()
