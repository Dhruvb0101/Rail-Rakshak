from fastapi import APIRouter
from app.schemas.all_schemas import AlertSchema, AlertUpdateRequest

router = APIRouter(prefix="/alerts", tags=["Alerts"])

MOCK_ALERTS = [
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

@router.get("/", response_model=list[AlertSchema])
async def list_alerts():
    return MOCK_ALERTS

@router.patch("/{alert_id}")
async def update_alert(alert_id: str, request: AlertUpdateRequest):
    return {
        "status": "success",
        "alertId": alert_id,
        "updatedFields": request.dict(exclude_unset=True)
    }
