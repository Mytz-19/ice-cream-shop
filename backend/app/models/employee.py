from pydantic import BaseModel


class Employee(BaseModel):
    id: str
    name: str
    image_url: str
    outstanding_amt: int


class EmployeeDetails(BaseModel):
    name: str
    image_url: str
    outstanding_amt: int
