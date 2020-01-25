from datetime import timedelta, date
from typing import List


def daterange(start_date: date, end_date: date = None) -> List[date]:
    if end_date is None:
        yield start_date

    else:
        for n in range(int((end_date - start_date).days) + 1):
            yield start_date + timedelta(n)
