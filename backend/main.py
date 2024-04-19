from uvicorn import run
from fastapi import FastAPI

from app.routers.employees import router as employee_router

app = FastAPI()

# Include the employees router
app.include_router(employee_router)


@app.get("/")
async def root():
    return {"message": "Hello World"}


if __name__ == "__main__":
    run(app, host="127.0.0.1", port=8080, reload=True)