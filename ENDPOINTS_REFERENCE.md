# All Backend Service Endpoints (Quick Reference)

## Auth Service (Port 8000)

| Method | Endpoint | Auth Required | Purpose |
|--------|----------|---------------|---------|
| GET | /health | No | Health check |
| POST | /api/v1/auth/login | No | Login with email/password, returns JWT token |
| GET | /api/v1/auth/rbac-roles | No | List all available roles |

**Demo Credentials:**
- Email: admin@pharmaflow.com (or admin@pharmacy.com / admin@pharmacy.local / etc.)
- Password: demo

---

## Inventory Service (Port 8001)

| Method | Endpoint | Auth Required | Purpose |
|--------|----------|---------------|---------|
| GET | /health | No | Health check |
| GET | /api/v1/inventory/products | Yes | Get all products |

---

## POS Service (Port 8002)

| Method | Endpoint | Auth Required | Purpose |
|--------|----------|---------------|---------|
| GET | /health | No | Health check |
| POST | /api/v1/pos/bill | Yes | Create bill with items, returns subtotal/tax/total |

**Request Body (POST /api/v1/pos/bill):**
```json
{
  "outlet_id": 1,
  "items": [
    {
      "product_id": 1,
      "qty": 2,
      "unit_price": 12.50
    }
  ]
}
```

---

## Orders Service (Port 8003)

| Method | Endpoint | Auth Required | Purpose |
|--------|----------|---------------|---------|
| GET | /health | No | Health check |
| POST | /api/v1/orders/replenishment | Yes | Create replenishment order |

**Request Body (POST /api/v1/orders/replenishment):**
```json
{
  "outlet_id": 1,
  "product_id": 1,
  "qty": 200
}
```

---

## Analytics Service (Port 8004)

| Method | Endpoint | Auth Required | Purpose |
|--------|----------|---------------|---------|
| GET | /health | No | Health check |
| GET | /api/v1/analytics/dashboard/{outlet_id} | Yes | Get dashboard metrics for outlet |

**Example:** `/api/v1/analytics/dashboard/1`

---

## AI Service (Port 8005)

| Method | Endpoint | Auth Required | Purpose |
|--------|----------|---------------|---------|
| GET | /health | No | Health check |
| GET | /api/v1/ai/reorder-insights/{outlet_id} | Yes | Get AI reorder recommendations for outlet |
| POST | /api/v1/ai/ask | Yes | Ask AI a question about operations |

**Example GET:** `/api/v1/ai/reorder-insights/1`

**Request Body (POST /api/v1/ai/ask):**
```json
{
  "question": "What should I reorder today?"
}
```

---

## Summary

**Total Endpoints:** 15

- **Public (No JWT):** 6 endpoints (/health × 6 services + auth/login + auth/rbac-roles)
- **Protected (JWT Required):** 9 endpoints (all data/business logic endpoints)

**Port Map:**
- 8000 → Auth
- 8001 → Inventory
- 8002 → POS
- 8003 → Orders
- 8004 → Analytics
- 8005 → AI

---

## Testing All Endpoints (One Command)

See [API_TEST_GUIDE.md](API_TEST_GUIDE.md) for complete PowerShell test scripts and copy-paste examples.
