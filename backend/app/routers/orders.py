from typing import Any, Dict, List

from fastapi import APIRouter, HTTPException, Response

from app.models.order import Order
from app.models.enums.collections import Collection
from db.db_manager import DBManager

router = APIRouter()


@router.get("/orders", summary="Return list of orders", response_model=List[Order])
async def get_all_orders() -> List[Order]:
    try:
        docs = DBManager().read_all_entries(collection_name=Collection.ORDER)
        if docs:
            order_list = []
            for doc in docs:
                order_data = {
                    "id": doc.id,
                    **doc.to_dict()
                }
                print(order_data)
                order_list.append(Order(**order_data))
            return order_list
        else:
            raise HTTPException(status_code=404, detail="orders not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/order/{id}", summary="Return order", response_model=Order)
async def get_order_by_id(id: str) -> Order:
    try:
        doc = DBManager().read_by_id(collection_name=Collection.ORDER, document_id=id)
        if doc:
            return Order(id=id, **doc)
        else:
            raise HTTPException(status_code=404, detail="order not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/order", summary="Update order details", response_model=str)
async def post_order(order_detail: Order) -> str:
    try:
        data = DBManager().create(collection_name=Collection.ORDER, data=order_detail.model_dump())
        if data:
            return data
        else:
            HTTPException(status_code=404, detail="order detail can't be added")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.delete("/order/{id}", summary="Delete order by id", status_code=204)
async def delete_order(id: str):
    try:
        order_deleted = DBManager().delete_by_id(collection_name=Collection.ORDER, document_id=id)
        if order_deleted:
            return Response(status_code=204)
        else:
            raise HTTPException(status_code=404, detail="order detail can't be removed")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.put("/order/{id}", summary="New order details", status_code=204)
async def put_order(id: str, updated_details: Dict[str, Any]):
    try:
        order_updated = DBManager().update_by_id(collection_name=Collection.ORDER,
                                                 document_id=id, updated_data=updated_details)
        if order_updated:
            return Response(status_code=204)
        else:
            raise HTTPException(status_code=404, detail="order detail can't be updated")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
