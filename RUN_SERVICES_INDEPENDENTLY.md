# Run Each Docker Service Independently

Run each backend service as a standalone container and test endpoints.

---

## 1. AUTH SERVICE (Port 8000)

**Start only Auth service:**
```bash
docker compose -f backend/docker-compose.yml up -d auth
```

**Test Auth endpoints:**
```powershell
# Health check
Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing

# Swagger docs
Start-Process "http://localhost:8000/docs"

# Login
$body = @{ email = "admin@pharmaflow.com"; password = "demo" } | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:8000/api/v1/auth/login" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing

# Get roles
Invoke-WebRequest -Uri "http://localhost:8000/api/v1/auth/rbac-roles" -UseBasicParsing
```

**Stop Auth:**
```bash
docker compose -f backend/docker-compose.yml down
```

---

## 2. INVENTORY SERVICE (Port 8001)

**Start Inventory + Auth services (Auth issues JWT token):**
```bash
docker compose -f backend/docker-compose.yml up -d auth inventory
```

**Test Inventory endpoints:**
```powershell
# Health check
Invoke-WebRequest -Uri "http://localhost:8001/health" -UseBasicParsing

# Swagger docs
Start-Process "http://localhost:8001/docs"

# Login on Auth service to get JWT token
$loginBody = @{ email = "admin@pharmaflow.com"; password = "demo" } | ConvertTo-Json
$loginResponse = Invoke-WebRequest -Uri "http://localhost:8000/api/v1/auth/login" -Method POST -ContentType "application/json" -Body $loginBody -UseBasicParsing
$token = ($loginResponse.Content | ConvertFrom-Json).data.access_token
$headers = @{ Authorization = "Bearer $token" }

# Get all products
Invoke-WebRequest -Uri "http://localhost:8001/api/v1/inventory/products" -Headers $headers -UseBasicParsing

# Get product by ID
Invoke-WebRequest -Uri "http://localhost:8001/api/v1/inventory/products/1" -Headers $headers -UseBasicParsing
```

**Stop Inventory:**
```bash
docker compose -f backend/docker-compose.yml down
```

---

## 3. POS SERVICE (Port 8002)

**Start only POS service:**
```bash
docker compose -f backend/docker-compose.yml up -d pos
```

**Test POS endpoints:**
```powershell
# Health check
Invoke-WebRequest -Uri "http://localhost:8002/health" -UseBasicParsing

# Swagger docs
Start-Process "http://localhost:8002/docs"

# Get transactions
Invoke-WebRequest -Uri "http://localhost:8002/api/v1/transactions" -UseBasicParsing

# Create transaction
$body = @{
    outlet = "Downtown Pharmacy"
    items = @(@{ sku = "AMX500"; name = "Amoxicillin"; qty = 2; price = 1500 })
    total = 3225
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8002/api/v1/transactions" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing
```

**Stop POS:**
```bash
docker compose -f backend/docker-compose.yml down
```

---

## 4. ORDERS SERVICE (Port 8003)

**Start only Orders service:**
```bash
docker compose -f backend/docker-compose.yml up -d orders
```

**Test Orders endpoints:**
```powershell
# Health check
Invoke-WebRequest -Uri "http://localhost:8003/health" -UseBasicParsing

# Swagger docs
Start-Process "http://localhost:8003/docs"

# Get all orders
Invoke-WebRequest -Uri "http://localhost:8003/api/v1/orders" -UseBasicParsing

# Get pending orders
Invoke-WebRequest -Uri "http://localhost:8003/api/v1/orders?status=pending" -UseBasicParsing

# Create order
$body = @{
    product = "Amoxicillin 500mg"
    outlet = "Downtown Pharmacy"
    qty = 200
    requestedBy = "Dr. Priya Sharma"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8003/api/v1/orders" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing
```

**Stop Orders:**
```bash
docker compose -f backend/docker-compose.yml down
```

---

## 5. ANALYTICS SERVICE (Port 8004)

**Start only Analytics service:**
```bash
docker compose -f backend/docker-compose.yml up -d analytics
```

**Test Analytics endpoints:**
```powershell
# Health check
Invoke-WebRequest -Uri "http://localhost:8004/health" -UseBasicParsing

# Swagger docs
Start-Process "http://localhost:8004/docs"

# Get metrics
Invoke-WebRequest -Uri "http://localhost:8004/api/v1/metrics" -UseBasicParsing

# Get dashboard
Invoke-WebRequest -Uri "http://localhost:8004/api/v1/dashboard" -UseBasicParsing

# Get reports
Invoke-WebRequest -Uri "http://localhost:8004/api/v1/reports" -UseBasicParsing
```

**Stop Analytics:**
```bash
docker compose -f backend/docker-compose.yml down
```

---

## 6. AI SERVICE (Port 8005)

**Start only AI service:**
```bash
docker compose -f backend/docker-compose.yml up -d ai
```

**Test AI endpoints:**
```powershell
# Health check
Invoke-WebRequest -Uri "http://localhost:8005/health" -UseBasicParsing

# Swagger docs
Start-Process "http://localhost:8005/docs"

# Get all insights
Invoke-WebRequest -Uri "http://localhost:8005/api/v1/insights" -UseBasicParsing

# Ask AI question
$body = @{
    question = "What are the top 5 selling medicines?"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8005/api/v1/insights" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing
```

**Stop AI:**
```bash
docker compose -f backend/docker-compose.yml down
```

---

## Start ALL Services Together

```bash
docker compose -f backend/docker-compose.yml up --build -d
```

**Verify all running:**
```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

---

## Quick Test All Endpoints

```powershell
$services = @(
    @{name="Auth"; port=8000},
    @{name="Inventory"; port=8001},
    @{name="POS"; port=8002},
    @{name="Orders"; port=8003},
    @{name="Analytics"; port=8004},
    @{name="AI"; port=8005}
)

foreach ($svc in $services) {
    try {
        $r = Invoke-WebRequest -Uri "http://localhost:$($svc.port)/docs" -UseBasicParsing -TimeoutSec 3
        Write-Host "✓ $($svc.name) ($($svc.port)): $($r.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "✗ $($svc.name) ($($svc.port)): NOT RUNNING" -ForegroundColor Red
    }
}
```

---

## Cleanup

**Stop all services:**
```bash
docker compose -f backend/docker-compose.yml down
```

**Remove all containers:**
```bash
docker compose -f backend/docker-compose.yml down -v
```

**Check running containers:**
```bash
docker ps
```
