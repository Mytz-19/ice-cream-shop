from pydantic import BaseModel


class Employee(BaseModel):
    name: str
    picture_url: str