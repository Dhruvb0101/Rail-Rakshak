from fastapi import APIRouter
from app.schemas.all_schemas import KPISummaryResponse

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/kpis", response_model=KPISummaryResponse)
async def get_dashboard_kpis():
    return KPISummaryResponse(
        trackNetworkKm=4280.0,
        trackNetworkChangeKm=12.0,
        trackHealthPct=94.8,
        trackHealthStatus="STABLE",
        activeAlertsCount=17,
        criticalAlertsCount=3,
        aiDetectionsToday=1284,
        aiDetectionsCapPct=85,
        maintenanceDueCount=42,
        openInspectionsCount=8,
    )
