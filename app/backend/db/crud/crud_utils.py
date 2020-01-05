def put_values_if_not_none(db, obj, **kwargs):
    for attr, value in kwargs.items():
        if value is not None:
            setattr(obj, attr, value)
    
    db.commit()
    db.refresh(obj)
    