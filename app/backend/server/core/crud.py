import os
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

from models import *  # pylint: disable=wildcard-import, unused-wildcard-import

username = os.environ.get('ONE_REPORT_USERNAME', 'one_report')
password = os.environ.get('ONE_REPORT_PASSWORD', 'one_report')
host = os.environ.get('ONE_REPORT_HOST', 'localhost')
db = os.environ.get('ONE_REPORT_DB', 'one_report')
port = os.environ.get('ONE_REPORT_PORT', '5432')
DATABASE_URI = f'postgres+psycopg2://{username}:{password}@{host}:{port}/{db}'

engine = create_engine(DATABASE_URI)
Session = sessionmaker(bind=engine)
s = Session()


def recreate_database():
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    mador = Mador(name='pie')
    mador_settings = MadorSettings(
        mador=mador, key='default_reminder_time', value='08:00', type='time')

    s.add_all([mador, mador_settings])
    s.commit()
