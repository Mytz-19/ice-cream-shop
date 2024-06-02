from typing import Any, Dict, List

from fastapi import APIRouter, HTTPException, Response

from app.models.product import Product, ProductDetails
from app.models.enums.collections import Collection
from db.db_manager import DBManager


router = APIRouter()


@router.get("/products", summary="Return list of products", response_model=List[Product])
async def get_all_products() -> List[Product]:
    try:
        docs = DBManager().read_all_entries(collection_name=Collection.PRODUCT)
        if docs:
            product_list = []
            for doc in docs:
                product_data = {
                    "id": doc.id,
                    **doc.to_dict()
                }
                product_list.append(Product(**product_data))
            return product_list
        else:
            raise HTTPException(status_code=404, detail="products not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")


@router.get("/product/{id}", summary="Return product", response_model=Product)
async def get_product_by_id(id: str) -> Product:
    try:
        doc = DBManager().read_by_id(collection_name=Collection.PRODUCT, document_id=id)
        if doc:
            return Product(id=id, **doc)
        else:
            raise HTTPException(status_code=404, detail="product not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")


@router.post("/product", summary="Update product details", response_model=str)
async def post_product(product_detail: ProductDetails) -> str:
    try:
        data = DBManager().create(collection_name=Collection.PRODUCT, data=product_detail.model_dump())
        if data:
            return data
        else:
            HTTPException(status_code=404, detail="product detail can't be added")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")


@router.delete("/product/{id}", summary="Delete product by id", status_code=204)
async def delete_product(id: str):
    try:
        product_deleted = DBManager().delete_by_id(collection_name=Collection.PRODUCT, document_id=id)
        if product_deleted:
            return Response(status_code=204)
        else:
            raise HTTPException(status_code=404, detail="product detail can't be removed")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")


@router.put("/product/{id}", summary="Create product", status_code=204)
async def put_product(id: str, updated_details: Dict[str, Any]):
    try:
        product_updated = DBManager().update_by_id(collection_name=Collection.PRODUCT,
                                                   document_id=id, updated_data=updated_details)
        if product_updated:
            return Response(status_code=204)
        else:
            raise HTTPException(status_code=404, detail="product detail can't be updated")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")
