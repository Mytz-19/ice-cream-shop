from pydantic import BaseModel


class Employee(BaseModel):
    id: str
    name: str
    image_url: str
    outstanding_amt: float


class EmployeeDetails(BaseModel):
    name: str
    image_url: str
    outstanding_amt: float
