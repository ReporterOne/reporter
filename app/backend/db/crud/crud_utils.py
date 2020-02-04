"""Crud Utils"""


def put_values(db, obj, should_commit=False, **kwargs):
    """Put values in a given object."""
    for attr, value in kwargs.items():
        setattr(obj, attr, value)

    if should_commit:
        db.commit()
        db.refresh(obj)

    return obj
