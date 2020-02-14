""""Test Class that setups a db for testing."""
import unittest
from collections import namedtuple
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from starlette.testclient import TestClient

from server.main import app
from server.api.v1 import api_v1
from db import models
from db.database import get_db
from tests.backend.utils.fake_users_generator import get_fake_current_user


StateMock = namedtuple("state", "name")


class TestQuery(unittest.TestCase):
    """"Generic test class for routes or crud functions."""
    API_V1_TEST = TestClient(api_v1)
    APP_TEST = TestClient(app)

    def get_test_db(self):
        """"Replacement for get_db for the routers dependencies."""
        return self.session

    def set_up_db_consts(self):
        """Sets up consts from the db."""
        # Create Reasons:
        self.current_user, self.current_user_token = \
            get_fake_current_user(self.APP_TEST, self.session, "one report")

        admin_permission = models.Permission(type="admin")
        self.session.add_all([admin_permission])
        self.session.commit()

        self.reasons = {"1_abc": "abc", "2_bcd": "bcd", "3_efg": "efg"}
        self.session.add_all([models.date_datas.Reason(name=reason)
                              for reason in self.reasons.values()])
        self.session.commit()

        self.state_here = StateMock(name="here")
        self.state_not_here = StateMock(name="not_here")

    def set_up_fake_db(self):
        """"Sets up db at the setup of every test."""
        raise NotImplementedError

    def setUp(self):
        self.engine = create_engine('sqlite://',
                                    connect_args={'check_same_thread': False})
        self.session = Session(self.engine)
        models.Base.metadata.drop_all(self.engine)
        models.Base.metadata.create_all(self.engine)
        app.dependency_overrides[get_db] = self.get_test_db
        api_v1.dependency_overrides[get_db] = self.get_test_db

        self.set_up_db_consts()
        self.set_up_fake_db()
