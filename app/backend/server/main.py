"""Main backend API serving."""
from pathlib import Path
from pydantic import BaseModel

from fastapi import FastAPI
from starlette.requests import Request
from starlette.staticfiles import StaticFiles
from starlette.templating import Jinja2Templates

from .dates_router import router


app = FastAPI(debug=True)  # pylint: disable=invalid-name

base_dir = Path(__file__).parent
app.mount("/static", StaticFiles(directory=str(base_dir / "static")), name="static")
templates = Jinja2Templates(directory=str(base_dir / "templates"))


<<<<<<< HEAD
@app.get("/")
=======
@app.get("/api/test_me", response_model=TestModel)
async def test_me():
    """Serve a test method."""
    return {"test": 123, "test2": 1234}


@app.get("/.*")
>>>>>>> master
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


app.include_router(
    router.router,
    tags=["Get Dates"]
)