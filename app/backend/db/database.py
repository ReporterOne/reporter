# pylint: skip-file
"""
Usage:
    database.py reset
    database.py clear
    database.py init
"""
import os
import json
import docopt
from contextlib import contextmanager

from passlib.context import CryptContext
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

from db import models


if 'DATABASE_URL' in os.environ:
    DATABASE_URI = os.environ['DATABASE_URL']

else:
    USERNAME = os.environ.get('ONE_REPORT_USERNAME', 'one_report')
    PASSWORD = os.environ.get('ONE_REPORT_PASSWORD', 'one_report')
    HOST = os.environ.get('ONE_REPORT_HOST', 'localhost')
    DB = os.environ.get('ONE_REPORT_DB', 'one_report')
    PORT = os.environ.get('ONE_REPORT_PORT', '5432')
    DATABASE_URI = f'postgresql://{USERNAME}:{PASSWORD}@{HOST}:{PORT}/{DB}'

BASE_PATH = os.path.dirname(os.path.abspath(__file__))

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


def clear_database():
    # Start DB From Scratch
    models.Base.metadata.drop_all(engine)


def initialize_database():
    """Create database for self use."""
    print(DATABASE_URI)
    with transaction() as s:
        # Create Madors:
        # Creat Permissions:
        admin_permission = models.Permission(type="admin")
        operator_permission = models.Permission(type="reporter")
        commander_permission = models.Permission(type="commander")

        s.add_all([admin_permission, operator_permission,
                   commander_permission])
        s.commit()

        # Create Reasons:
        with open(f"{BASE_PATH}/fixtures/reasons.json", 'r') as f:
            reasons = json.loads(f.read())

        s.add_all([models.date_datas.Reason(name=reason) for reason in
                   reasons.values()])

        # Create Users:
        one_report = models.User(english_name="One Report",
                                 username="one_report",
                                 password=get_password_hash("one_report"),
                                 permissions=[
                                     commander_permission,
                                     admin_permission])
        s.add(one_report)
        s.commit()


def reset_database():
    """Reset database"""
    # Start DB From Scratch
    models.Base.metadata.drop_all(engine)
    models.Base.metadata.create_all(engine)
    initialize_database()


if __name__ == '__main__':
    args = docopt.docopt(__doc__)
    if args["clear"]:
        clear_database()

    if args["reset"]:
        reset_database()

    elif args["init"]:
        initialize_database()
