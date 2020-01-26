"""Test Utils"""
from datetime import date
from utils.datetime_utils import daterange


def test_daterange():
    """Test daterange util."""
    date_range = [
        date(1997, 1, 3),
        date(1997, 1, 4),
        date(1997, 1, 5),
        date(1997, 1, 6),
        date(1997, 1, 7),
        date(1997, 1, 8),
        date(1997, 1, 9),
        date(1997, 1, 10)]

    assert [day for day in daterange(date_range[0], date_range[-1])] == date_range
    assert [day for day in daterange(date_range[0])] == [date_range[0]]
