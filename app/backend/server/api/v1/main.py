"""All routers related to api v1."""
from fastapi import FastAPI

from . import dates_data, users, madors, statuses

api_v1 = FastAPI(openapi_prefix="/api/v1", debug=True)

api_v1.include_router(
    dates_data.router,
    tags=["Dates"],
    prefix="/dates_status"
)

api_v1.include_router(
    statuses.router,
    tags=["Dates"],
    prefix="/statuses"
)

api_v1.include_router(
    users.router,
    tags=["Users"],
    prefix="/users"
)

api_v1.include_router(
    madors.router,
    tags=["Madors"],
    prefix="/madors"
)
