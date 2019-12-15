import os
import json
from contextlib import contextmanager

from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

from db import models
from db.models.date_datas import Reason


USERNAME = os.environ.get('ONE_REPORT_USERNAME', 'one_report')
PASSWORD = os.environ.get('ONE_REPORT_PASSWORD', 'one_report')
HOST = os.environ.get('ONE_REPORT_HOST', 'localhost')
DB = os.environ.get('ONE_REPORT_DB', 'one_report')
PORT = os.environ.get('ONE_REPORT_PORT', '5432')

DATABASE_URI = f'postgres+psycopg2://{USERNAME}:{PASSWORD}@{HOST}:{PORT}/{DB}'

engine = create_engine(DATABASE_URI)
Session = sessionmaker(bind=engine)


@contextmanager
def transaction():
    s = Session()
    try:
        yield s

    except:
        s.rollback()
        raise

    finally:
        s.close()

def recreate_database():
    with transaction() as s:
        models.Base.metadata.drop_all(engine)
        models.Base.metadata.create_all(engine)

        # Create Madors:
        pie = models.Mador(name='Pie')
        pie_settings = models.MadorSettings(
            mador=pie, key='default_reminder_time', value='09:00', type='time')

        homeland = models.Mador(name='HomeLand')
        homeland_settings = models.MadorSettings(
            mador=homeland, key='default_reminder_time', value='09:00', type='time')

        s.add_all([pie, pie_settings, homeland, homeland_settings])
        

        # Creat Permissions:
        admin_permission = models.Permission(type="admin")
        reporter_permission = models.Permission(type="reporter")
        commander_permission = models.Permission(type="commander")
        user_permission = models.Permission(type="user")

        s.add_all([admin_permission, reporter_permission, 
                   commander_permission, user_permission])

        # Create Reasons:
        with open("./app/backend/utils/reasons.json", 'r') as f:
            reasons = json.loads(f.read())

        s.add_all([Reason(reason=reason) for reason in reasons.values()])

        # Create Users:
        # TODO

        # Commit changes to db:
        s.commit()

