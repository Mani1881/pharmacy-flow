from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import jwt
from jose.exceptions import JWTError
from passlib.context import CryptContext
import os

SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")
ALGO = "HS256"
security = HTTPBearer(auto_error=False)
pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(p: str) -> str:
    return pwd.hash(p)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd.verify(plain, hashed)

def create_access_token(sub: str, role: str) -> str:
    now = datetime.now(timezone.utc)
    payload = {"sub": sub, "role": role, "type": "access", "iat": int(now.timestamp()), "exp": int((now + timedelta(minutes=30)).timestamp())}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGO)

def decode_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGO])
    except JWTError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token") from exc
    if payload.get("type") != "access":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Access token required")
    return payload

def require_roles(*roles: str):
    async def _guard(creds: HTTPAuthorizationCredentials | None = Depends(security)):
        if creds is None:
            raise HTTPException(status_code=401, detail="Bearer token required")
        payload = decode_access_token(creds.credentials)
        if payload.get("role") not in roles:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return payload
    return _guard
