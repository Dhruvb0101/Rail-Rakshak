from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import dashboard, detections, alerts

app = FastAPI(
    title="RailRakshak AI — Industrial Railway Backend",
    description="REST API for AI Defect Detection, Infrastructure Telemetry & Predictive Maintenance",
    version="2.4.0",
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

@app.get("/")
async def root():
    return {
        "platform": "RailRakshak AI",
        "tagline": "Predict. Prevent. Protect.",
        "status": "ONLINE",
        "version": settings.AI_MODEL_VERSION,
        "docsUrl": "/docs"
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "ai_engine": settings.AI_MODEL_NAME,
        "active_division": "Delhi Division"
    }
