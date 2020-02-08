from fastapi import APIRouter

from . import basic, facebook, google

router = APIRouter()
router.include_router(basic.router)
router.include_router(google.router)
router.include_router(facebook.router)

