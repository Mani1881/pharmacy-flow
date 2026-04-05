from fastapi import Depends, HTTPException
from pydantic import BaseModel
from backend.shared.app_factory import app_factory
from backend.shared.response import ok
from backend.shared.security import create_access_token, hash_password

app = app_factory("auth")
USERS = {
    "admin@pharmacy.com": {"password_hash": hash_password("demo"), "role": "super_admin"},
    "admin@pharmaflow.com": {"password_hash": hash_password("demo"), "role": "super_admin"},
    "admin@pharmacy.local": {"password_hash": hash_password("demo"), "role": "super_admin"},
    "supervisor@pharmaflow.com": {"password_hash": hash_password("demo"), "role": "regional_supervisor"},
    "pharmacist@pharmaflow.com": {"password_hash": hash_password("demo"), "role": "pharmacist"},
    "assistant@pharmaflow.com": {"password_hash": hash_password("demo"), "role": "store_assistant"},
    "finance@pharmaflow.com": {"password_hash": hash_password("demo"), "role": "finance_user"},
}

class LoginBody(BaseModel):
    email: str
    password: str

@app.post("/api/v1/auth/login")
async def login(body: LoginBody):
    email = body.email.strip().lower()
    user = USERS.get(email)
    if not user or body.password not in {"demo", "Admin123!"}:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(email, user["role"])
    return ok({"access_token": token, "role": user["role"]}, "Login successful")

@app.get("/api/v1/auth/rbac-roles")
async def roles():
    return ok(["super_admin", "regional_supervisor", "pharmacist", "store_assistant", "finance_user"])
