"""Main backend API serving."""
from pathlib import Path
from pydantic import BaseModel

from fastapi import FastAPI
from starlette.staticfiles import StaticFiles


class TestModel(BaseModel):
    """Test model."""
    test: int
    test2: int


app = FastAPI(debug=True)  # pylint: disable=invalid-name

base_dir = Path(__file__).parent


@app.get("/api/test_me", response_model=TestModel)
async def index():
    """Serve a test method."""
    return {"test": 123, "test2": 1234}


app.mount("/", StaticFiles(directory=str(base_dir / "static"), html=True), name="static")
