from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class Receipt(BaseModel):
    cost: float
    product_id: str
    quantity: int


class Order(BaseModel):
    id: Optional[str] = None
    date: str
    total_cost: float
    outstanding_amt: Optional[float] = None
    employee_id: str
    receipt: Optional[List[Receipt]] = None