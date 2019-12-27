from fastapi import FastAPI

from . import dates_router

api_v1 = FastAPI(openapi_prefix="/api/v1")

api_v1.include_router(
    dates_router.router,
    tags=["Get Dates"]
)
