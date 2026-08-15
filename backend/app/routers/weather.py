from fastapi import APIRouter
from typing import List
from app.schemas.all_schemas import WeatherCurrentSchema, WeatherForecastItemSchema
from app.services.weather_service import weather_service

router = APIRouter(prefix="/weather", tags=["Weather Intelligence"])

@router.get("/current", response_model=WeatherCurrentSchema)
async def get_current_weather():
    return await weather_service.get_current_weather()

@router.get("/forecast", response_model=List[WeatherForecastItemSchema])
async def get_weather_forecast():
    return await weather_service.get_forecast()

@router.get("/risk")
async def get_weather_risk_summary():
    weather = await weather_service.get_current_weather()
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
