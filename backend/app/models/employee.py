from pydantic import BaseModel


class Employee(BaseModel):
    name: str
    image_url: str
    outstanding_amt: int