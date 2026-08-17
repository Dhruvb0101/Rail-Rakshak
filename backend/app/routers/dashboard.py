from fastapi import APIRouter
from app.schemas.all_schemas import KPISummaryResponse
from app.core.supabase import fetch_all

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

# Fallback KPI data when Supabase is unavailable or empty
FALLBACK_KPIS = KPISummaryResponse(
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
    liveTrainsCount=47,
    runningTrainsCount=39,
    delayedTrainsCount=6,
    weatherCondition="Heavy Rain",
    weatherRiskScore=68,
)


@router.get("/kpis", response_model=KPISummaryResponse)
async def get_dashboard_kpis():
    """Fetch KPI data from Supabase; fallback to demo data if unavailable."""
    rows = await fetch_all("kpis", order_by="snapshot_at", limit=1)
    if rows:
        row = rows[0]
        return KPISummaryResponse(
            trackNetworkKm=row.get("track_network_km", 4280.0),
            trackNetworkChangeKm=row.get("track_network_change_km", 12.0),
            trackHealthPct=row.get("track_health_pct", 94.8),
            trackHealthStatus=row.get("track_health_status", "STABLE"),
            activeAlertsCount=row.get("active_alerts_count", 0),
            criticalAlertsCount=row.get("critical_alerts_count", 0),
            aiDetectionsToday=row.get("ai_detections_today", 0),
            aiDetectionsCapPct=row.get("ai_detections_cap_pct", 0),
            maintenanceDueCount=row.get("maintenance_due_count", 0),
            openInspectionsCount=row.get("open_inspections_count", 0),
            liveTrainsCount=row.get("live_trains_count", 0),
            runningTrainsCount=row.get("running_trains_count", 0),
            delayedTrainsCount=row.get("delayed_trains_count", 0),
            weatherCondition=row.get("weather_condition", "Clear"),
            weatherRiskScore=row.get("weather_risk_score", 0),
        )
    return FALLBACK_KPIS
