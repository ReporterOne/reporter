from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

from models import *  # pylint: disable=wildcard-import, unused-wildcard-import

username = input("enter db username")
password = input("enter db password")
host = input("enter db host")
DATABASE_URI = f'postgres+psycopg2://{username}:{password}@{host}:5432/one_report'

engine = create_engine(DATABASE_URI)
Session = sessionmaker(bind=engine)
s = Session()

def recreate_database():
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    mador = Mador(name='pie')
    mador_settings = MadorSettings(mador=mador, key='default_reminder_time', value='08:00', type='time')

    s.add_all([mador, mador_settings])
    s.commit()

