from fastapi import Depends
from pydantic import BaseModel
from backend.shared.app_factory import app_factory
from backend.shared.response import ok
from backend.shared.security import require_roles

app = app_factory("ai")

@app.get("/api/v1/ai/reorder-insights/{outlet_id}")
async def insights(outlet_id: int, _=Depends(require_roles("super_admin", "regional_supervisor", "pharmacist", "finance_user"))):
    return ok({"outlet_id": outlet_id, "insights": [{"sku": "PARA-500", "recommended_qty": 300}]})

class AskBody(BaseModel):
    question: str

@app.post("/api/v1/ai/ask")
async def ask(body: AskBody, _=Depends(require_roles("super_admin", "regional_supervisor", "pharmacist", "finance_user"))):
    return ok({"question": body.question, "answer": "Use dashboard and reorder endpoints for actions."})
