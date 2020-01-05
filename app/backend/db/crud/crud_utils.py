"""Crud Utils"""
def put_values_if_not_none(db, obj, **kwargs):
    """Put value from kwargs in obj if not none."""
    for attr, value in kwargs.items():
        if value is not None:
            setattr(obj, attr, value)

    db.commit()
    db.refresh(obj)
