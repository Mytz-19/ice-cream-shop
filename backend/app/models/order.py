from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class Receipt(BaseModel):
    cost: float
    product_id: str
    quantity: int


class Order(BaseModel):
    id: Optional[str]
    receipt: Receipt
    date: datetime
    employee_id: str
    total_cost: float
