from fastapi import Depends
from pydantic import BaseModel, Field
from backend.shared.app_factory import app_factory
from backend.shared.response import ok
from backend.shared.security import require_roles

app = app_factory("orders")

class Replenishment(BaseModel):
    outlet_id: int
    product_id: int
    qty: int = Field(ge=1)

@app.post("/api/v1/orders/replenishment")
async def create_order(body: Replenishment, _=Depends(require_roles("super_admin", "regional_supervisor", "pharmacist"))):
    return ok({"order_id": "RO-001", "status": "pending_approval", **body.model_dump()})
