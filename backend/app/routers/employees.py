from typing import List
from fastapi import APIRouter
from app.models.employee import Employee

from db.db_manager import DBManager
from app.models.enums.collections import Collection
# from db.firebase.firestore_manager import read_employee_data

router = APIRouter()
db_manager = DBManager()

@router.get("/employees")
async def get_employees():
    data = db_manager.read_all_entries(collection_name=Collection.EMPLOYEES)
    # if name not in employee_db:
    #     raise HTTPException(status_code=404, detail="Employee not found")
    
    return data


@router.get("/employee/{id}")
async def get_employee_by_id(id: str):
    data = db_manager.read_by_id(collection_name=Collection.EMPLOYEES, document_id=id)
    return data


@router.post("/employee/{id}")
async def post_employee(id: str):
    return id


@router.delete("/employee/{id}")
async def delete_employee(id: str):
    return id


@router.put("/employee/{id}")
async def put_employee(id: str, outstanding_amt: int):
    return id, outstanding_amt
