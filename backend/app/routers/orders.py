from typing import Any, Dict, List
import uuid

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
                raw_date = doc.to_dict().get("date")
                formatted_date = (
                    raw_date.isoformat() if hasattr(raw_date, "isoformat") else raw_date
                )

                # Fetch the employee document to get outstanding_amt
                employee_id = doc.to_dict().get("employee_id")
                employee_doc = DBManager().read_by_id(
                    collection_name=Collection.EMPLOYEES, document_id=employee_id
                )
                outstanding_amt = employee_doc.get("outstanding_amt", 0) if employee_doc else 0

                order_data = {
                    "id": doc.id,
                    **doc.to_dict(),
                    "receipt": doc.to_dict().get("receipt", None),  # Provide a default value
                    "date": formatted_date,  # Use the formatted date
                    "outstanding_amt": outstanding_amt
                }
                # Ensure order_data matches the Order model
                try:
                    order_list.append(order_data)
                except TypeError as e:
                    raise HTTPException(
                        status_code=500,
                        detail=f"Data mismatch: {e}. Order data: {order_data}",
                    ) from e
            return order_list
        else:
            raise HTTPException(status_code=404, detail="orders not found")
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {e}",
        )

@router.get("/order/{id}", summary="Return order", response_model=Order)
async def get_order_by_id(id: str) -> Order:
    try:
        doc = DBManager().read_by_id(collection_name=Collection.ORDER, document_id=id)
        if doc:
            return Order(id=id, **doc)
        else:
            raise HTTPException(status_code=404, detail="order not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")


@router.post("/order", summary="Update order details", response_model=str)
async def post_order(order_detail: Order) -> str:
    try:
        # Generate a unique ID for the order
        order_id = str(uuid.uuid4())
        
        employee_updated = DBManager().update_by_id(collection_name=Collection.EMPLOYEES,
                                                    document_id=order_detail.employee_id,
                                                    updated_data={
                                                        'outstanding_amt': order_detail.outstanding_amt
                                                    })
        if not employee_updated:
            raise HTTPException(status_code=404, detail="Employee detail can't be updated")

        # Include the generated ID in the order data
        order_data = order_detail.model_dump()
        order_data["id"] = order_id

        # Remove the 'outstanding_amt' field if it exists
        order_data.pop("outstanding_amt", None)

        # Save the order to the database
        data = DBManager().create(
            collection_name=Collection.ORDER, data=order_data
        )
        if data:
            return order_id  # Return the generated ID
        else:
            raise HTTPException(status_code=404, detail="Order detail can't be added")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")

@router.delete("/order/{id}", summary="Delete order by id", status_code=204)
async def delete_order(id: str):
    try:
        order_deleted = DBManager().delete_by_id(
            collection_name=Collection.ORDER, document_id=id
        )
        if order_deleted:
            return Response(status_code=204)
        else:
            raise HTTPException(status_code=404, detail="order detail can't be removed")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")


@router.put("/order/{id}", summary="New order details", status_code=204)
async def put_order(id: str, updated_details: Dict[str, Any]):
    try:
        order_updated = DBManager().update_by_id(
            collection_name=Collection.ORDER,
            document_id=id,
            updated_data=updated_details,
        )
        if order_updated:
            return Response(status_code=204)
        else:
            raise HTTPException(status_code=404, detail="order detail can't be updated")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")
