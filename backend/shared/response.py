from datetime import datetime, timezone

def ok(data, message="Success"):
    return {"status": "success", "message": message, "data": data, "errors": None, "timestamp": datetime.now(timezone.utc).isoformat()}
