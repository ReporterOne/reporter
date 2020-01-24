"""Util functions for backend testing."""
from faker import Faker

from db import models

def get_fake_user():
    fake = Faker(['en_US'])
    full_name = fake.name()
    return models.User(english_name=full_name,
                       username=full_name.replace(" ", ""),
                       password="Password1!")
