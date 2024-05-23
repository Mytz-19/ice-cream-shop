from contextlib import asynccontextmanager

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from app.routers.employees import router as employee_router
from app.routers.products import router as product_router
from app.routers.orders import router as order_router
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow specific origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Include the employees router
app.include_router(employee_router, tags=["Employee"])
# Include the products router
app.include_router(product_router, tags=["Product"])
# Include the orders router
app.include_router(order_router, tags=["Order"])
