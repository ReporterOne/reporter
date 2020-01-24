""""Test Class that setups a db for testing."""
import json
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
# from pytest import unittest
import unittest

from db import models


class TestQuery(unittest.TestCase):
    def set_up_db_consts(self):
        # Create Reasons:
        with open("./app/backend/utils/reasons.json", 'r') as f:
            reasons = json.loads(f.read())

        self.session.add_all([models.date_datas.Reason(name=reason)
                              for reason in reasons.values()])
        self.session.commit()

    def set_up_fake_db(self):
        raise NotImplementedError
        # self.panel = Panel(1, 'ion torrent', 'start')
        # self.session.add(self.panel)
        # self.session.commit()

    def setUp(self):
        self.engine = create_engine('sqlite:///:memory:')
        self.session = Session(self.engine)
        models.Base.metadata.create_all(self.engine)
        self.set_up_db_consts()
        self.set_up_fake_db()

    def tearDown(self):
        models.Base.metadata.drop_all(self.engine)

    # def test_query_panel(self):
    #     expected = [self.panel]
    #     result = self.session.query(Panel).all()
    #     self.assertEqual(result, expected)
