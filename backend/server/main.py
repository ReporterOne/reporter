from fastapi import FastAPI

app = FastAPI(debug=True)


@app.get("/api/test_me")
def index():
    return {"test": 123, "test2": 1234}
