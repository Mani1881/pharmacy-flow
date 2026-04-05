# API Endpoint Test Guide (Manual)

This file lists all currently implemented endpoints in the backend services and how to test them manually.

## Start Services

```bash
docker compose -f backend/docker-compose.yml up -d auth inventory pos orders analytics ai
```

---

## 1. Get JWT Token First (Required for protected endpoints)

```powershell
$loginBody = @{
    email = "admin@pharmaflow.com"
    password = "demo"
} | ConvertTo-Json

$loginResponse = Invoke-WebRequest -Uri "http://localhost:8000/api/v1/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body $loginBody `
  -UseBasicParsing

$token = ($loginResponse.Content | ConvertFrom-Json).data.access_token
$headers = @{ Authorization = "Bearer $token" }
```

---

## 2. Auth Service (Port 8000)

Docs: http://localhost:8000/docs

```powershell
# Public health
Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing

# Login (public)
Invoke-WebRequest -Uri "http://localhost:8000/api/v1/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body $loginBody `
  -UseBasicParsing

# RBAC roles (public)
Invoke-WebRequest -Uri "http://localhost:8000/api/v1/auth/rbac-roles" -UseBasicParsing
```

Implemented endpoints:
- GET /health
- POST /api/v1/auth/login
- GET /api/v1/auth/rbac-roles

---

## 3. Inventory Service (Port 8001)

Docs: http://localhost:8001/docs

```powershell
# Public health
Invoke-WebRequest -Uri "http://localhost:8001/health" -UseBasicParsing

# Protected endpoint
Invoke-WebRequest -Uri "http://localhost:8001/api/v1/inventory/products" -Headers $headers -UseBasicParsing
```

Implemented endpoints:
- GET /health
- GET /api/v1/inventory/products (JWT required)

---

## 4. POS Service (Port 8002)

Docs: http://localhost:8002/docs

```powershell
# Public health
Invoke-WebRequest -Uri "http://localhost:8002/health" -UseBasicParsing

# Protected endpoint
$billBody = @{
    outlet_id = 1
    items = @(
        @{ product_id = 1; qty = 2; unit_price = 12.5 },
        @{ product_id = 2; qty = 1; unit_price = 8.0 }
    )
} | ConvertTo-Json -Depth 4

Invoke-WebRequest -Uri "http://localhost:8002/api/v1/pos/bill" `
  -Method POST `
  -ContentType "application/json" `
  -Headers $headers `
  -Body $billBody `
  -UseBasicParsing
```

Implemented endpoints:
- GET /health
- POST /api/v1/pos/bill (JWT required)

---

## 5. Orders Service (Port 8003)

Docs: http://localhost:8003/docs

```powershell
# Public health
Invoke-WebRequest -Uri "http://localhost:8003/health" -UseBasicParsing

# Protected endpoint
$orderBody = @{
    outlet_id = 1
    product_id = 1
    qty = 200
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8003/api/v1/orders/replenishment" `
  -Method POST `
  -ContentType "application/json" `
  -Headers $headers `
  -Body $orderBody `
  -UseBasicParsing
```

Implemented endpoints:
- GET /health
- POST /api/v1/orders/replenishment (JWT required)

---

## 6. Analytics Service (Port 8004)

Docs: http://localhost:8004/docs

```powershell
# Public health
Invoke-WebRequest -Uri "http://localhost:8004/health" -UseBasicParsing

# Protected endpoint
Invoke-WebRequest -Uri "http://localhost:8004/api/v1/analytics/dashboard/1" -Headers $headers -UseBasicParsing
```

Implemented endpoints:
- GET /health
- GET /api/v1/analytics/dashboard/{outlet_id} (JWT required)

---

## 7. AI Service (Port 8005)

Docs: http://localhost:8005/docs

```powershell
# Public health
Invoke-WebRequest -Uri "http://localhost:8005/health" -UseBasicParsing

# Protected endpoint 1
Invoke-WebRequest -Uri "http://localhost:8005/api/v1/ai/reorder-insights/1" -Headers $headers -UseBasicParsing

# Protected endpoint 2
$askBody = @{ question = "What should I reorder today?" } | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:8005/api/v1/ai/ask" `
  -Method POST `
  -ContentType "application/json" `
  -Headers $headers `
  -Body $askBody `
  -UseBasicParsing
```

Implemented endpoints:
- GET /health
- GET /api/v1/ai/reorder-insights/{outlet_id} (JWT required)
- POST /api/v1/ai/ask (JWT required)

---

## 8. One-Shot Manual Test Script (All Endpoints)

```powershell
# Login + token
$loginBody = @{ email = "admin@pharmaflow.com"; password = "demo" } | ConvertTo-Json
$loginResponse = Invoke-WebRequest -Uri "http://localhost:8000/api/v1/auth/login" -Method POST -ContentType "application/json" -Body $loginBody -UseBasicParsing
$token = ($loginResponse.Content | ConvertFrom-Json).data.access_token
$headers = @{ Authorization = "Bearer $token" }

# Auth
Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing
Invoke-WebRequest -Uri "http://localhost:8000/api/v1/auth/rbac-roles" -UseBasicParsing

# Inventory
Invoke-WebRequest -Uri "http://localhost:8001/health" -UseBasicParsing
Invoke-WebRequest -Uri "http://localhost:8001/api/v1/inventory/products" -Headers $headers -UseBasicParsing

# POS
$billBody = @{ outlet_id = 1; items = @(@{ product_id = 1; qty = 2; unit_price = 12.5 }) } | ConvertTo-Json -Depth 4
Invoke-WebRequest -Uri "http://localhost:8002/health" -UseBasicParsing
Invoke-WebRequest -Uri "http://localhost:8002/api/v1/pos/bill" -Method POST -ContentType "application/json" -Headers $headers -Body $billBody -UseBasicParsing

# Orders
$orderBody = @{ outlet_id = 1; product_id = 1; qty = 100 } | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:8003/health" -UseBasicParsing
Invoke-WebRequest -Uri "http://localhost:8003/api/v1/orders/replenishment" -Method POST -ContentType "application/json" -Headers $headers -Body $orderBody -UseBasicParsing

# Analytics
Invoke-WebRequest -Uri "http://localhost:8004/health" -UseBasicParsing
Invoke-WebRequest -Uri "http://localhost:8004/api/v1/analytics/dashboard/1" -Headers $headers -UseBasicParsing

# AI
$askBody = @{ question = "What should I reorder today?" } | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:8005/health" -UseBasicParsing
Invoke-WebRequest -Uri "http://localhost:8005/api/v1/ai/reorder-insights/1" -Headers $headers -UseBasicParsing
Invoke-WebRequest -Uri "http://localhost:8005/api/v1/ai/ask" -Method POST -ContentType "application/json" -Headers $headers -Body $askBody -UseBasicParsing
```

---

## Notes

- If you get `401 Bearer token required`, header is missing.
- If you get `Invalid token`, generate a fresh token from auth login and retry.
- If a service is down, start it with:
  - `docker compose -f backend/docker-compose.yml up -d <service-name>`
