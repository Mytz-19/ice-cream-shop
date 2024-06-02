from typing import Optional

from pydantic import BaseModel

class PricePerQty(BaseModel):
    qty: int
    price: float

class Product(BaseModel):
    id: str
    name: str
    piece: PricePerQty
    box: Optional[PricePerQty] = None


class ProductDetails(BaseModel):
    name: str
    piece: PricePerQty
    box: Optional[PricePerQty] = None
