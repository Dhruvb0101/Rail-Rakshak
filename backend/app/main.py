from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.supabase import is_supabase_available
from app.routers import dashboard, detections, alerts, trains, weather

app = FastAPI(
    title="RailRakshak AI — Industrial Railway Backend",
    description="REST API & WebSocket Server for AI Defect Detection, Live Train Tracking, Weather Intelligence & Predictive Maintenance",
    version="2.5.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard.router, prefix=settings.API_V1_STR)
app.include_router(detections.router, prefix=settings.API_V1_STR)
app.include_router(alerts.router, prefix=settings.API_V1_STR)
app.include_router(trains.router, prefix=settings.API_V1_STR)
app.include_router(weather.router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {
        "platform": "RailRakshak AI",
        "tagline": "Predict. Prevent. Protect.",
        "status": "ONLINE",
        "version": settings.AI_MODEL_VERSION,
        "demoMode": settings.DEMO_MODE,
        "docsUrl": "/docs"
    }

@app.get("/api/health")
async def health_check():
    supabase_status = "connected" if is_supabase_available() else "not_configured (demo fallback)"
    return {
        "status": "healthy",
        "database": supabase_status,
        "database_provider": "Supabase (PostgreSQL)",
        "ai_engine": settings.AI_MODEL_NAME,
        "train_tracker": "active (RailRadar provider + simulation fallback)",
        "weather_engine": "active (OpenWeather provider + risk scoring)",
        "active_division": "Delhi Division"
    }

