from fastapi import Depends
from backend.shared.app_factory import app_factory
from backend.shared.response import ok
from backend.shared.security import require_roles

app = app_factory("inventory")

@app.get("/api/v1/inventory/products")
async def products(_=Depends(require_roles("super_admin", "regional_supervisor", "pharmacist", "store_assistant", "finance_user"))):
    return ok([{"id": 1, "sku": "PARA-500", "name": "Paracetamol 500mg", "stock": 42}])
