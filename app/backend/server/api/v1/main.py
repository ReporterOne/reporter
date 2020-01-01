from fastapi import FastAPI

from . import dates_router, users_router, madors_router

api_v1 = FastAPI(openapi_prefix="/api/v1")

api_v1.include_router(
    dates_router.router,
    tags=["Dates"],
    prefix="/dates_status"
)

api_v1.include_router(
    users_router.router,
    tags=["Users"],
    prefix="/users"
)

api_v1.include_router(
    madors_router.router,
    tags=["Madors"],
    prefix="/madors"
)
