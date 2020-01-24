"""Util functions for backend testing."""
from faker import Faker
from starlette.testclient import TestClient
from fastapi.security import OAuth2PasswordRequestForm
from boltons.urlutils import URL, QueryParamDict
from sqlalchemy.orm import Session

from db import models
from server import auth
from server.main import app

TEST_APP = TestClient(app)

def _get_fake_username_password():
    fake = Faker(['en_US'])
    full_name = fake.name()
    return full_name, full_name.replace(" ", ""), "Password1!"

def _get_faked_user_token(username: str, password: str):
    url = URL('/api/login')
    query = QueryParamDict(username=username,
                           password=password)
    # url.query_params = query
    print(url.to_text())
    return TEST_APP.post(url.to_text(),
                         data=query.to_text(),
                         headers={
                             'content-type': 'application/x-www-form-urlencoded'
                             }
                        ).json()

def get_fake_current_user(db: Session):
    full_name, username, password = _get_fake_username_password()
    current_user = models.User(
            english_name=full_name,
            username=username,
            password=auth.get_password_hash(password)
        )
    db.add(current_user)
    db.commit()
    token = _get_faked_user_token(username=username, password=password)
    return current_user, token

def get_fake_user():
    full_name, username, password = _get_fake_username_password()
    return models.User(
            english_name=full_name,
            username=username,
            password=auth.get_password_hash(password)
        )
