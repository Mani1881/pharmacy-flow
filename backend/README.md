# Backend Microservices Scaffold

Run services:

docker compose -f backend/docker-compose.yml up --build

API docs after startup:
- http://localhost:8000/docs
- http://localhost:8001/docs
- http://localhost:8002/docs
- http://localhost:8003/docs
- http://localhost:8004/docs
- http://localhost:8005/docs

RBAC guards are enabled per route using JWT role claims.
