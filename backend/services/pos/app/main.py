from fastapi import Depends
from pydantic import BaseModel, Field
from backend.shared.app_factory import app_factory
from backend.shared.response import ok
from backend.shared.security import require_roles

app = app_factory("pos")

class BillItem(BaseModel):
    product_id: int
    qty: int = Field(ge=1)
    unit_price: float = Field(gt=0)

class BillBody(BaseModel):
    outlet_id: int
    items: list[BillItem]

@app.post("/api/v1/pos/bill")
async def bill(body: BillBody, _=Depends(require_roles("super_admin", "regional_supervisor", "pharmacist", "store_assistant"))):
    subtotal = sum(i.qty * i.unit_price for i in body.items)
    tax = round(subtotal * 0.05, 2)
    return ok({"subtotal": round(subtotal, 2), "tax": tax, "total": round(subtotal + tax, 2)})
