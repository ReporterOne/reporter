"""Tests for users router."""
from http.client import OK

from db import models
from tests.backend.test_query import TestQuery
from tests.backend.utils.url_utils import URL
from tests.backend.utils.fake_users_generator import get_fake_user
from db.crud.users import get_user
from tests.backend.utils.snapshot import response_snapshot


class TestDatesStatus(TestQuery):
    def set_up_fake_db(self):
        # Create Madors:
        group = models.Mador(name='Group')
        group_settings = models.MadorSettings(
            mador=group, key='default_reminder_time', value='09:00', type='time')
        self.session.add_all([group_settings, group])

        # Creat Permissions:
        commander_permission = models.Permission(type="commander")
        user_permission = models.Permission(type="user")
        self.session.add_all([commander_permission, user_permission])
        self.session.commit()

        self.user = get_fake_user()
        self.user.permissions = [user_permission]

        self.current_user.permissions = [user_permission, commander_permission]
        self.current_user.soldiers = [self.user]

        group.assign_mador_for_users([self.user, self.current_user])

        self.session.add(self.user)
        self.session.commit()

    def test_get_user(self):
        """"Test for get_user from users router."""
        url = URL(url=f'/users/{self.user.id}')
        response = self.API_V1_TEST.get(
                url.to_text(),
                headers={'authorization': f'bearer {self.current_user_token}'}
            )
        assert response.status_code == OK
        assert response_snapshot(0, response.json())

    def test_delete_user(self):
        """"Test for delete_user from users router."""
        url = URL(url=f'/users/{self.user.id}')
        response = self.API_V1_TEST.delete(
                url.to_text(),
                headers={'authorization': f'bearer {self.current_user_token}'}
            )
        assert response.status_code == OK

        #  checks if the user was acctually deleted from the db.
        assert get_user(db=self.session, user_id=self.user.id) is None

    def test_get_commander(self):
        """"Test for get_commander from users router."""
        url = URL(url=f'/users/{self.user.id}/commander_id')
        response = self.API_V1_TEST.get(
                url.to_text(),
                headers={'authorization': f'bearer {self.current_user_token}'}
            )
        assert response.status_code == OK
        assert response_snapshot(0, response.json())

    def test_get_subjects(self):
        """"Test for get_subjects from users router."""
        url = URL(url=f'/users/{self.current_user.id}/subjects')
        response = self.API_V1_TEST.get(
                url.to_text(),
                headers={'authorization': f'bearer {self.current_user_token}'}
            )
        assert response.status_code == OK
        assert response_snapshot(0, response.json())

    def test_get_current_user(self):
        """"Test for get_current_user from users router."""
        url = URL(url='/users/me')
        response = self.API_V1_TEST.get(
                url.to_text(),
                headers={'authorization': f'bearer {self.current_user_token}'}
            )
        assert response.status_code == OK
        assert response_snapshot(0, response.json())
