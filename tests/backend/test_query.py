""""Test Class that setups a db for testing."""
import json
import unittest
from collections import namedtuple
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from starlette.testclient import TestClient
# from pytest import unittest

from db import models
from server.main import app
from server.api.v1 import api_v1
from db.database import get_db


StateMock = namedtuple("state", "name")

class TestQuery(unittest.TestCase):
    API_V1_TEST = TestClient(api_v1)
    APP_TEST = TestClient(app)

    def get_test_db(self):
        return self.session

    def set_up_db_consts(self):
        # Create Reasons:
        self.reasons = {"1_abc": "abc", "2_bcd": "bcd", "3_efg": "efg"}
        self.session.add_all([models.date_datas.Reason(name=reason)
                              for reason in self.reasons.values()])
        self.session.commit()

        self.state_here = StateMock(name="here")
        self.state_not_here = StateMock(name="not_here")

    def set_up_fake_db(self):
        raise NotImplementedError
        # self.panel = Panel(1, 'ion torrent', 'start')
        # self.session.add(self.panel)
        # self.session.commit()

    def setUp(self):
        self.engine = create_engine('sqlite:///:memory:', 
                                    connect_args={'check_same_thread': False})
        self.session = Session(self.engine)
        models.Base.metadata.create_all(self.engine)
        app.dependency_overrides[get_db] = self.get_test_db
        api_v1.dependency_overrides[get_db] = self.get_test_db
        
        self.set_up_db_consts()
        self.set_up_fake_db()

    def tearDown(self):
        models.Base.metadata.drop_all(self.engine)

    # def test_query_panel(self):
    #     expected = [self.panel]
    #     result = self.session.query(Panel).all()
    #     self.assertEqual(result, expected)
