"""Util functions for backend testing."""
from faker import Faker
from sqlalchemy.orm import Session
from starlette.testclient import TestClient
from boltons.urlutils import URL, QueryParamDict

from db import models
from server import auth

def _get_fake_username_password():
    fake = Faker(['en_US'])
    full_name = fake.name()
    return full_name, full_name.replace(" ", ""), "Password1!"

def _get_faked_user_token(app_test: TestClient, username: str, password: str):
    url = URL('/api/login')
    query = QueryParamDict(
            username=username,
            password=password,
            scopes="personal"
        )
    # url.query_params = query
    print(url.to_text())
    return app_test.post(url.to_text(),
                         data=query.to_text(),
                         headers={
                             'content-type': 'application/x-www-form-urlencoded'
                             }
                        ).json()['access_token']

def get_fake_current_user(app_test: TestClient, db: Session):
    full_name, username, password = _get_fake_username_password()
    current_user = models.User(
            english_name=full_name,
            username=username,
            password=auth.get_password_hash(password)
        )
    db.add(current_user)
    db.commit()
    token = _get_faked_user_token(
            app_test=app_test,
            username=username,
            password=password
        )
    return current_user, token

def get_fake_user():
    full_name, username, password = _get_fake_username_password()
    return models.User(
            english_name=full_name,
            username=username,
            password=auth.get_password_hash(password)
        )
