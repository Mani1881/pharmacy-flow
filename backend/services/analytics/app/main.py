from fastapi import Depends
from backend.shared.app_factory import app_factory
from backend.shared.response import ok
from backend.shared.security import require_roles

app = app_factory("analytics")

@app.get("/api/v1/analytics/dashboard/{outlet_id}")
async def dashboard(outlet_id: int, _=Depends(require_roles("super_admin", "regional_supervisor", "pharmacist", "finance_user"))):
    return ok({"outlet_id": outlet_id, "sales_today": 128740.0, "transactions_today": 312})
