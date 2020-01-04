"""All routers related to api v1."""
from fastapi import FastAPI

from . import dates_data, user

api_v1 = FastAPI(openapi_prefix="/api/v1")

api_v1.include_router(
    dates_data.router,
    tags=["Dates"],
    prefix="/dates_status"
)

api_v1.include_router(
    user.router,
    tags=["Users"],
    prefix="/users"
)
