""""Testing fot dates_data_routes."""

from datetime import date
from starlette.testclient import TestClient
from boltons.urlutils import URL, QueryParamDict

from tests.backend.test_query import TestQuery
from tests.backend.test_utils import get_fake_user
from app.backend.server.api.v1 import api_v1
from db import models

client = TestClient(api_v1)
fake_secret_token = "secret-token"

fake_db = {}


class TestDatesStatus(TestQuery):
    def set_up_fake_db(self):
        # Create Madors:
        group = models.Mador(name='Group')
        group_settings = models.MadorSettings(
            mador=group, key='default_reminder_time', value='09:00', type='time')
        self.session.add(group)

        # Creat Permissions:
        commander_permission = models.Permission(type="commander")
        user_permission = models.Permission(type="user")
        self.session.add_all([commander_permission, user_permission])
        self.session.commit()

        self.user = get_fake_user()
        self.user.permissions = [user_permission]
        self.current_user = get_fake_user()
        self.current_user.permissions = [user_permission, commander_permission]
        self.current_user.soldiers = [self.user]

        group.assign_mador_for_users([self.user, self.current_user])

        self.session.add_all([self.user, self.current_user])
        self.session.commit()

    def test_get_dates_status(self):
        start_date = date(1997, 1, 3)
        end_date = date(1997, 1, 4)
        query = QueryParamDict(start=start_date, end=end_date, users_id=[self.user.id])
        url = URL('/api/v1/dates_status/')
        url.query_params = query
        response = client.get(url.to_text(), json={})
        assert response.status_code == 200
        print(response.json)
        assert response.json == {}
