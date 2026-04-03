from fastapi import Depends, HTTPException
from pydantic import BaseModel, EmailStr
from backend.shared.app_factory import app_factory
from backend.shared.response import ok
from backend.shared.security import hash_password, verify_password, create_access_token, require_roles

app = app_factory("auth")
USERS = {"admin@pharmacy.local": {"password_hash": hash_password("Admin123!"), "role": "super_admin"}}

class LoginBody(BaseModel):
    email: EmailStr
    password: str

@app.post("/api/v1/auth/login")
async def login(body: LoginBody):
    user = USERS.get(body.email)
    if not user or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(body.email, user["role"])
    return ok({"access_token": token, "role": user["role"]}, "Login successful")

@app.get("/api/v1/auth/rbac-roles")
async def roles(_=Depends(require_roles("super_admin"))):
    return ok(["super_admin", "regional_supervisor", "pharmacist", "store_assistant", "finance_user"])
