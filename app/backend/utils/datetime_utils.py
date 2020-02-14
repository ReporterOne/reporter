from datetime import timedelta, date
from typing import List

from db.models import DateDetails


def daterange(start_date: date, end_date: date = None) -> List[date]:
    if end_date is None:
        yield start_date

    else:
        for n in range(int((end_date - start_date).days) + 1):
            yield start_date + timedelta(n)


def as_dict(date_details):
    return {
        detail.date: detail
        for detail in date_details
    }


def fill_missing(details, users_id, start, end, flat=False):
    to_ret = []
    for day in daterange(start, end):
        data = []
        date_type = DateDetails.UNKNOWN
        if day in details:
            current = details[day]
            date_type = current.type
            # filter out relevant users
            data = [user_data for user_data in current.datas
                    if user_data.user_id in users_id]

        if flat:
            if len(data) == 1:
                data = data[0]

            elif len(data) == 0:
                data = None

        to_ret.append({
            "date": day,
            "type": date_type,
            "data": data
        })

    return to_ret
