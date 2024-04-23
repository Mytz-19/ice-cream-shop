from typing import Any, Dict, List

from fastapi import APIRouter, HTTPException, Response

from app.models.employee import Employee, EmployeeDetails
from app.models.enums.collections import Collection
from db.db_manager import DBManager


router = APIRouter()


@router.get("/employees", summary="Return list of employees", response_model=List[Employee])
async def get_all_employees() -> List[Employee]:
    try:
        docs = DBManager().read_all_entries(collection_name=Collection.EMPLOYEES)
        if docs:
            employee_list = []
            for doc in docs:
                employee_data = {
                    "id": doc.id,
                    **doc.to_dict()
                }
                employee_list.append(Employee(**employee_data))
            return employee_list
        else:
            raise HTTPException(status_code=404, detail="Employees not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/employee/{id}", summary="Return employee", response_model=Employee)
async def get_employee_by_id(id: str) -> Employee:
    try:
        doc = DBManager().read_by_id(collection_name=Collection.EMPLOYEES, document_id=id)
        if doc:
            return Employee(id=id, **doc)
        else:
            raise HTTPException(status_code=404, detail="Employee not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/employee", summary="Update employee details", response_model=str)
async def post_employee(employee_detail: EmployeeDetails) -> str:
    try:
        data = DBManager().create(collection_name=Collection.EMPLOYEES, data=employee_detail.model_dump())
        if data:
            return data
        else:
            HTTPException(status_code=404, detail="Employee detail can't be added")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.delete("/employee/{id}", summary="Delete employee by id", status_code=204)
async def delete_employee(id: str):
    try:
        employee_deleted = DBManager().delete_by_id(collection_name=Collection.EMPLOYEES, document_id=id)
        if employee_deleted:
            return Response(status_code=204)
        else:
            raise HTTPException(status_code=404, detail="Employee detail can't be removed")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.put("/employee/{id}", summary="New employee details", status_code=204)
async def put_employee(id: str, updated_details: Dict[str, Any]):
    try:
        employee_updated = DBManager().update_by_id(collection_name=Collection.EMPLOYEES,
                                                    document_id=id, updated_data=updated_details)
        if employee_updated:
            return Response(status_code=204)
        else:
            raise HTTPException(status_code=404, detail="Employee detail can't be updated")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
