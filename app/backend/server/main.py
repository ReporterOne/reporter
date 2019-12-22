"""Main backend API serving."""
from pathlib import Path
from pydantic import BaseModel

from fastapi import FastAPI
from starlette.requests import Request
from starlette.staticfiles import StaticFiles
from starlette.templating import Jinja2Templates

from .routers import dates_router


app = FastAPI(debug=True)  # pylint: disable=invalid-name

base_dir = Path(__file__).parent
app.mount("/static", StaticFiles(directory=str(base_dir / "static")), name="static")
templates = Jinja2Templates(directory=str(base_dir / "templates"))


@app.get("/")
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


app.include_router(
    dates_router.router,
    tags=["Get Dates"]
)