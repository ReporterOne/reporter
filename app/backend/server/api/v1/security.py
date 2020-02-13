from contextlib import contextmanager

from fastapi import HTTPException
from starlette.status import HTTP_403_FORBIDDEN

from db import crud


def get_all_users_in_tree(user):
    to_ret = [user]
    current_soldiers = user.soldiers
    to_ret += current_soldiers
    for soldier in current_soldiers:
        to_ret += get_all_users_in_tree(soldier)

    return to_ret


def get_all_allowed_users_of(db, user):
    if crud.users.is_admin(db, user):
        return crud.users.get_all_users(db)

    allowed_users = get_all_users_in_tree(user)
    operates_madors = user.operates
    for mador in operates_madors:
        allowed_users += mador.users

    return list(set(allowed_users))


def get_all_allowed_user_ids_of(db, user):
    return [_user.id for _user in get_all_allowed_users_of(db, user)]


@contextmanager
def secure_user_accessing(db, current_user, user_ids):
    allowed = get_all_allowed_user_ids_of(db, current_user)
    if any(user_id not in allowed for user_id in user_ids):
        raise HTTPException(status_code=HTTP_403_FORBIDDEN,
                            detail="You are not allowed to access some of "
                                   "requested users!")
    yield
