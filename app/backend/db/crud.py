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
        s.commit()
        

        # Creat Permissions:
        admin_permission = models.Permission(type="admin")
        operator_permission = models.Permission(type="reporter")
        commander_permission = models.Permission(type="commander")
        user_permission = models.Permission(type="user")

        s.add_all([admin_permission, operator_permission, 
                   commander_permission, user_permission])
        s.commit()

        # Create Reasons:
        with open("./app/backend/utils/reasons.json", 'r') as f:
            reasons = json.loads(f.read())

        s.add_all([Reason(reason=reason) for reason in reasons.values()])
        s.commit()

        # Create Users:
        users = [
            models.User(english_name='Michael Tugy', username='tugmica', password='Aa12345678', 
                        permissions=[user_permission, commander_permission, admin_permission]),
            models.User(english_name='Elran Shefer', username='shobe', password='Bb12345678', 
                        permissions=[user_permission, commander_permission]),
            models.User(english_name='Ariel Domb', username='damov', password='Cc12345678',
                        permissions=[user_permission, operator_permission])
            ]

        s.add_all(users)
        s.commit()

