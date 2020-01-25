""""Testing fot dates_data_routes."""
from http.client import OK
from datetime import date, datetime
from tests.backend.utils.url_utils import URL, Query

from db import models
from db.crud.date_datas import set_new_date_data, get_dates_data
from tests.backend.test_query import TestQuery
from tests.backend.utils.fake_users_generator import (
    get_fake_user, get_fake_current_user)


class TestDatesStatus(TestQuery):
    START_DATE = date(1997, 1, 3)
    END_DATE = date(1997, 1, 4)
    REPORTED_TIME = datetime(1997, 1, 3, 12, 12, 12)

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
        self.current_user, self.current_user_token = \
            get_fake_current_user(self.APP_TEST, self.session)

        self.current_user.permissions = [user_permission, commander_permission]
        self.current_user.soldiers = [self.user]

        group.assign_mador_for_users([self.user, self.current_user])

        self.session.add_all([self.user, self.current_user])
        self.session.commit()

        set_new_date_data(
            db=self.session,
            user_id=self.user.id,
            state=self.state_here,
            reported_by_id=self.current_user.id,
            reported_time=self.REPORTED_TIME,
            start_date=self.START_DATE,
            end_date=self.END_DATE
        )

    def test_get_dates_status(self):
        query = Query(
                start=self.START_DATE,
                end=self.END_DATE,
                users_id=[self.user.id]
            )
        url = URL(url='/dates_status/', query=query)
        response = self.API_V1_TEST.get(
                url.to_text(),
                headers={'authorization': f'bearer {self.current_user_token}'}
            )
        assert response.status_code == OK
        assert response.json() == [{
            'user_id': 1,
            'data': [
                {
                    'user_id': 1,
                    'state': 'here',
                    'reason': None,
                    'reported_by_id': 2,
                    'reported_time': '1997-01-03T12:12:12',
                    'date_details': {
                        'date': '1997-01-03',
                        'type': 'unknown'
                        }
                }, {
                    'user_id': 1,
                    'state': 'here',
                    'reason': None,
                    'reported_by_id': 2,
                    'reported_time': '1997-01-03T12:12:12',
                    'date_details': {
                        'date': '1997-01-04',
                        'type': 'unknown'
                        }
                }
            ]
        }]

    def test_post_dates_status(self):
        new_date = date(1999, 1, 5)
        url = URL('/dates_status/')
        response = self.API_V1_TEST.post(
            url.to_text(),
            headers={'authorization': f'bearer {self.current_user_token}'},
            json={
                    'user_id': self.user.id,
                    'start_date': str(new_date),
                    'state': self.state_not_here.name,
                    'reason': self.reasons["1_abc"],
                    'reported_by_id': self.current_user.id,
                    'reported_time': str(self.REPORTED_TIME)
                }
        )

        assert response.status_code == OK
        assert response.json() == {
            'user_id': 1,
            'data': [{
                'user_id': 1,
                'state': 'not_here',
                'reason': {
                    'name': 'abc'
                },
                'reported_by_id': 2,
                'reported_time': '1997-01-03T12:12:12',
                'date_details': {
                    'date': '1999-01-05',
                    'type': 'unknown'
                }
            }]
        }

    def test_delete_dates_status(self):
        query = Query(
                start=self.START_DATE,
                end=self.END_DATE,
                users_id=[self.user.id]
            )
        url = URL('/dates_status/', query=query)
        response = self.API_V1_TEST.delete(
            url.to_text(),
            headers={'authorization': f'bearer {self.current_user_token}'}
        )

        assert response.status_code == OK

        #  assert that the data was acctually deleted from the db.
        date_data = get_dates_data(
                            db=self.session,
                            user_id=self.user.id,
                            start_date=self.START_DATE,
                            end_date=self.END_DATE
                        )
        assert date_data == []

    def test_put_dates_status(self):
        url = URL('/dates_status/')
        response = self.API_V1_TEST.post(
            url.to_text(),
            headers={'authorization': f'bearer {self.current_user_token}'},
            json={
                    'user_id': self.user.id,
                    'start_date': str(self.START_DATE),
                    'state': self.state_not_here.name,
                    'reason': self.reasons["1_abc"],
                    'reported_by_id': self.user.id,
                    'reported_time': str(self.REPORTED_TIME)
                }
        )

        assert response.status_code == OK
        assert response.json() == {
            'user_id': 1,
            'data': [{
                'user_id': 1,
                'state': 'not_here',
                'reason': {
                        'name': 'abc'
                },
                'reported_by_id': 1,
                'reported_time': '1997-01-03T12:12:12',
                'date_details': {
                    'date': '1997-01-03',
                    'type': 'unknown'
                }
            }]
        }

    def test_get_reasons(self):
        url = URL('/dates_status/reasons')
        response = self.API_V1_TEST.get(
                url.to_text(),
                headers={'authorization': f'bearer {self.current_user_token}'}
            )

        assert response.status_code == OK
        assert response.json() == list(self.reasons.values())
