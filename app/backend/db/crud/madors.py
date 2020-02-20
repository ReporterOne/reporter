from typing import List

from sqlalchemy.orm import Session

from db import schemas
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
    user = db.query(User).filter(User.id == user_id).one()
    users = [user]
    soldiers = []
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

    users = set_hierarchy_recursive(db, mador, hierarchy)
    mador.users = users
    user_id = hierarchy.leader
    user = db.query(User).filter(User.id == user_id).one()
    if mador.manager:
        mador.manager.manages_mador = None
    db.commit()

    mador.manager = user
    db.commit()
