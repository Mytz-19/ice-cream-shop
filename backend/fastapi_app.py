from fastapi import FastAPI

from app.routers.employees import router as employee_router

app = FastAPI()

# Include the employees router
app.include_router(employee_router, tags=["Employee"])
