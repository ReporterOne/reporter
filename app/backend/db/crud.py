import os
from contextlib import contextmanager

from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

from db import models


USERNAME = os.environ.get('ONE_REPORT_USERNAME', 'one_report')
PASSWORD = os.environ.get('ONE_REPORT_PASSWORD', 'one_report')
HOST = os.environ.get('ONE_REPORT_HOST', 'localhost')
DB = os.environ.get('ONE_REPORT_DB', 'one_report')
PORT = os.environ.get('ONE_REPORT_PORT', '5432')

DATABASE_URI = f'postgres+psycopg2://{USERNAME}:{PASSWORD}@{HOST}:{PORT}/{DB}'

engine = create_engine(DATABASE_URI)
Session = sessionmaker(bind=engine)
s = Session()


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
    models.Base.metadata.drop_all(engine)
    models.Base.metadata.create_all(engine)
    mador = models.Mador(name='pie')
    mador_settings = models.MadorSettings(
        mador=mador, key='default_reminder_time', value='08:00', type='time')

    s.add_all([mador, mador_settings])
    s.commit()
