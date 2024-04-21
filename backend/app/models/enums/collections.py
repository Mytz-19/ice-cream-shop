from enum import Enum
from pydantic import BaseModel

class Collection(str, Enum):
    EMPLOYEES = 'Employees'
    PRODUCT = 'Product'
    ORDER = 'Order'