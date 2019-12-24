"""Main backend API serving."""
from pathlib import Path
from pydantic import BaseModel

from fastapi import FastAPI
from starlette.requests import Request
from starlette.staticfiles import StaticFiles
from starlette.templating import Jinja2Templates

from .routers import dates_router


app = FastAPI(debug=True)  # pylint: disable=invalid-name
api_v1 = FastAPI(openapi_prefix="/api/v1")

base_dir = Path(__file__).parent
app.mount("/static", StaticFiles(directory=str(base_dir / "static")), name="static")
app.mount("/api/v1", api_v1)

templates = Jinja2Templates(directory=str(base_dir / "templates"))

@app.get("/.*")
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


api_v1.include_router(
    dates_router.router,
    tags=["Get Dates"]
)
