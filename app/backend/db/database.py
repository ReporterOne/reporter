# pylint: skip-file
import os
import json
from contextlib import contextmanager

from faker import Faker
from passlib.context import CryptContext
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine, event

from db import models

USERNAME = os.environ.get('ONE_REPORT_USERNAME', 'one_report')
PASSWORD = os.environ.get('ONE_REPORT_PASSWORD', 'one_report')
HOST = os.environ.get('ONE_REPORT_HOST', 'localhost')
DB = os.environ.get('ONE_REPORT_DB', 'one_report')
PORT = os.environ.get('ONE_REPORT_PORT', '5432')

DATABASE_URI = f'postgresql://{USERNAME}:{PASSWORD}@{HOST}:{PORT}/{DB}'

engine = create_engine(DATABASE_URI)
Session = sessionmaker(bind=engine, autocommit=False, autoflush=False)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify the given password with the hashed password."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Get the given password hash."""
    return pwd_context.hash(password)


def get_db():
    db = Session()
    try:
        yield db

    except:  # noqa
        db.rollback()

    finally:
        db.close()


@contextmanager
def transaction():
    s = Session()
    try:
        yield s

    except:  # noqa
        s.rollback()
        raise

    finally:
        s.close()


@event.listens_for(models.User.__table__, 'after_create')
def insert_admin_user(*args, **kwargs):
    with transaction() as s:
        s.add(models.User(username='one_report',
                          english_name="One Report",
                          password=get_password_hash("one_report")))
        s.commit()


def recreate_database():
    """Create database for self use."""
    with transaction() as s:
        # Start DB From Scratch
        models.Base.metadata.drop_all(engine)
        models.Base.metadata.create_all(engine)

        # Create Madors:
        pie = models.Mador(name='Pie')
        pie_settings = models.MadorSettings(
            mador=pie, key='default_reminder_time', value='09:00', type='time')

        homeland = models.Mador(name='HomeLand')
        homeland_settings = models.MadorSettings(
            mador=homeland, key='default_reminder_time', value='09:00',
            type='time')

        s.add_all([pie, pie_settings, homeland, homeland_settings])

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

        s.add_all([models.date_datas.Reason(name=reason) for reason in
                   reasons.values()])

        # Create Users:
        elran = models.User(english_name='Elran Shefer', username='shobe',
                            password=pwd_context.hash('shobe12345678'),
                            permissions=[user_permission, commander_permission,
                                         admin_permission])
        tugy = models.User(english_name='Michael Tugy', username='tugmica',
                           password=pwd_context.hash('tuguy12345678'),
                           permissions=[user_permission, commander_permission])
        domb = models.User(english_name='Ariel Domb', username='damov',
                           password=pwd_context.hash('damovCc12345678'),
                           permissions=[user_permission, operator_permission])
        ido = models.User(english_name='Ido Azolay', username='ado',
                          password=pwd_context.hash('Ido12345678'),
                          permissions=[user_permission, operator_permission])

        # Create Randome Users:
        num_of_users = 20
        users = []
        fake = Faker(['en_US'])
        for _ in range(num_of_users):
            full_name = fake.name()
            users.append(models.User(english_name=full_name,
                                     username=full_name.replace(" ", ""),
                                     password="Password1!"))

        users += [elran, tugy, ido, domb]

        elran.soldiers = [tugy, users[0], users[1], users[2]]
        tugy.soldiers = [ido] + [users[i] for i in range(3, 11)]
        users[0].soldiers = [users[i] for i in range(11, 14)]
        users[1].soldiers = [users[i] for i in range(14, 17)]
        users[2].soldiers = [users[i] for i in range(17, 20)]

        pie.assign_mador_for_users(users)
        domb.mador = homeland

        s.add_all(users)
        s.commit()
