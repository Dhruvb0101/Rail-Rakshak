from fastapi import APIRouter
from app.schemas.all_schemas import AlertSchema, AlertUpdateRequest
from app.core.supabase import fetch_all, update_record

router = APIRouter(prefix="/alerts", tags=["Alerts"])

# Fallback alert data when Supabase is unavailable
FALLBACK_ALERTS = [
    {
        "id": "ALT-1001",
        "alertCode": "ALT-CRIT-001",
        "title": "Severe Rail Fracture Detected (KM 142.6)",
        "severity": "critical",
        "trackSection": "New Delhi – Ghaziabad Mainline Up",
        "locationKm": 142.6,
        "detectionSource": "Computer Vision IR + Acoustic Telemetry",
        "timestamp": "12 mins ago",
        "aiConfidence": 96.8,
        "status": "active",
        "assignedEngineer": "Er. Rajesh Sharma (SE/P-Way)"
    },
    {
        "id": "ALT-1002",
        "alertCode": "ALT-CRIT-002",
        "title": "High Rail Temperature Exceeded 58°C (Buckling Risk)",
        "severity": "critical",
        "trackSection": "Old Delhi – Ambala Route",
        "locationKm": 34.8,
        "detectionSource": "Fiber Optic DTS Sensor #DTS-09",
        "timestamp": "28 mins ago",
        "aiConfidence": 99.1,
        "status": "active",
        "assignedEngineer": "Control Room Duty Officer"
    }
]


def _row_to_alert(row: dict) -> dict:
    """Map a Supabase row to the AlertSchema format."""
    return {
        "id": row.get("id"),
        "alertCode": row.get("alert_code"),
        "title": row.get("title"),
        "severity": row.get("severity"),
        "trackSection": row.get("track_section"),
        "locationKm": row.get("location_km"),
        "detectionSource": row.get("detection_source"),
        "timestamp": row.get("created_at", ""),
        "aiConfidence": row.get("ai_confidence", 0),
        "status": row.get("status"),
        "assignedEngineer": row.get("assigned_engineer"),
    }


@router.get("/", response_model=list[AlertSchema])
async def list_alerts():
    """List alerts from Supabase; fallback to demo data."""
    rows = await fetch_all("alerts", order_by="created_at", limit=50)
    if rows:
        return [_row_to_alert(r) for r in rows]
    return FALLBACK_ALERTS


@router.patch("/{alert_id}")
async def update_alert(alert_id: str, request: AlertUpdateRequest):
    """Update alert fields in Supabase; fallback to in-memory response."""
    update_data = {}
    req_dict = request.dict(exclude_unset=True)

    # Map camelCase fields to snake_case DB columns
    field_map = {
        "status": "status",
        "assignedEngineer": "assigned_engineer",
        "severity": "severity",
    }
    for field, column in field_map.items():
        if field in req_dict:
            update_data[column] = req_dict[field]

    result = await update_record("alerts", "id", alert_id, update_data)
    if result:
        return {"status": "success", "alertId": alert_id, "updatedFields": req_dict, "source": "supabase"}

    return {
        "status": "success",
        "alertId": alert_id,
        "updatedFields": req_dict,
        "source": "fallback"
    }
