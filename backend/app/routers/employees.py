from fastapi import APIRouter
from app.models.employee import Employee

from firebase.firestore import read_employee_data

router = APIRouter()


@router.get("/employee")
async def get_employee():
    data = read_employee_data()
    # if name not in employee_db:
    #     raise HTTPException(status_code=404, detail="Employee not found")
    
    # picture_url = employee_db[name]
    return data