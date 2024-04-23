from pydantic import BaseModel


class Product(BaseModel):
    id: str
    name: str
    price: float


class ProductDetails(BaseModel):
    name: str
    price: float
