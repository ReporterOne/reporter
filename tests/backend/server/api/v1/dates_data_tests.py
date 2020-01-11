from starlette.testclient import TestClient
from app.backend.server.api.v1 import router
from boltons import urlutils

client = TestClient(router)
fake_secret_token = "secret-token"

fake_db = {}

def test_dates_status():
    query = urlutils.QueryParamDict(start=1, end=2, users_id=[123])
    response = client.get(f"/?{query.to_test()}")
