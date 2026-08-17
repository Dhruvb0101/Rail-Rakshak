from fastapi import APIRouter
from typing import List
from app.schemas.all_schemas import WeatherCurrentSchema, WeatherForecastItemSchema
from app.services.weather_service import weather_service
from app.core.supabase import fetch_all, is_supabase_available

router = APIRouter(prefix="/weather", tags=["Weather Intelligence"])


def _row_to_weather(row: dict) -> dict:
    """Map a Supabase weather_reports row to WeatherCurrentSchema format."""
    return {
        "city": row.get("city"),
        "division": row.get("division"),
        "temperatureC": row.get("temperature_c"),
        "feelsLikeC": row.get("feels_like_c"),
        "humidityPct": row.get("humidity_pct"),
        "windSpeedKmh": row.get("wind_speed_kmh"),
        "windDirectionDeg": row.get("wind_direction_deg"),
        "rainfallMm1h": row.get("rainfall_mm_1h", 0),
        "visibilityKm": row.get("visibility_km"),
        "pressureHpa": row.get("pressure_hpa"),
        "condition": row.get("condition"),
        "conditionIcon": row.get("condition_icon", "🌧️"),
        "weatherRiskScore": row.get("weather_risk_score", 0),
        "weatherRiskLevel": row.get("weather_risk_level", "LOW"),
        "drainageRisk": row.get("drainage_risk", "LOW"),
        "bucklingRisk": row.get("buckling_risk", "LOW"),
        "catenaryRisk": row.get("catenary_risk", "LOW"),
        "visibilityRisk": row.get("visibility_risk", "NORMAL"),
        "trackImpactSummary": row.get("track_impact_summary", ""),
        "lastUpdated": row.get("created_at", ""),
        "dataSource": row.get("data_source", "SUPABASE"),
    }


@router.get("/current", response_model=WeatherCurrentSchema)
async def get_current_weather():
    """Fetch latest weather from Supabase; fallback to weather_service."""
    if is_supabase_available():
        rows = await fetch_all("weather_reports", order_by="created_at", limit=1)
        if rows:
            return _row_to_weather(rows[0])
    return await weather_service.get_current_weather()


@router.get("/forecast", response_model=List[WeatherForecastItemSchema])
async def get_weather_forecast():
    return await weather_service.get_forecast()


@router.get("/risk")
async def get_weather_risk_summary():
    weather = await get_current_weather()
    # Handle both dict and pydantic model returns
    if isinstance(weather, dict):
        return {
            "division": weather.get("division"),
            "weatherRiskScore": weather.get("weatherRiskScore"),
            "weatherRiskLevel": weather.get("weatherRiskLevel"),
            "subsystemRisks": {
                "drainage": weather.get("drainageRisk"),
                "railBuckling": weather.get("bucklingRisk"),
                "catenary": weather.get("catenaryRisk"),
                "visibility": weather.get("visibilityRisk"),
            },
            "trackImpactSummary": weather.get("trackImpactSummary"),
            "recommendedMitigation": "Deploy monsoon patrolling gang between KM 140–155; impose 60 km/h speed restriction during peak downpours."
        }
    return {
        "division": weather.division,
        "weatherRiskScore": weather.weatherRiskScore,
        "weatherRiskLevel": weather.weatherRiskLevel,
        "subsystemRisks": {
            "drainage": weather.drainageRisk,
            "railBuckling": weather.bucklingRisk,
            "catenary": weather.catenaryRisk,
            "visibility": weather.visibilityRisk
        },
        "trackImpactSummary": weather.trackImpactSummary,
        "recommendedMitigation": "Deploy monsoon patrolling gang between KM 140–155; impose 60 km/h speed restriction during peak downpours."
    }
