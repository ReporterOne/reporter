from datetime import timedelta

def daterange(start_date, end_date):
    if end_date is None:
        return [start_date]

    for n in range(int ((end_date - start_date).days)):
        yield start_date + timedelta(n)