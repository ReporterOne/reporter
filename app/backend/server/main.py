"""Main backend API serving."""
from pydantic import BaseModel

from fastapi import FastAPI


class TestModel(BaseModel):
    """Test model."""
    test: int
    test2: int


app = FastAPI(debug=True)  # pylint: disable=invalid-name


@app.get("/api/test_me", response_model=TestModel)
async def index():
    """Serve a test method."""
    return {"test": 123, "test2": 1234}
