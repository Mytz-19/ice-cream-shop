from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.routers.employees import router as employee_router
from db.db_manager import DBManager


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Connect to Firebase
    db_manager = DBManager()
    # Application is running
    yield
    # Release the resources
    db_manager.close()

app = FastAPI(lifespan=lifespan)

# Include the employees router
app.include_router(employee_router, tags=["Employee"])
