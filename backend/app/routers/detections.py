from fastapi import APIRouter
from app.schemas.all_schemas import DetectionCreateRequest, AnalysisResultResponse
from app.services.ai_inference import ai_pipeline

router = APIRouter(prefix="/detections", tags=["Detections"])

@router.post("/analyze", response_model=AnalysisResultResponse)
async def analyze_defect(request: DetectionCreateRequest):
    return ai_pipeline.analyze_scan(request)

@router.get("/")
async def list_detections():
    return {
        "status": "success",
        "total": 1284,
        "items": [
            {
                "id": "DET-2026-0892",
                "detectionCode": "#TF-8992",
                "defectType": "Transverse Rail Fracture Crack",
                "severity": "critical",
                "confidence": 96.8,
                "locationKm": 142.6,
                "trackSection": "New Delhi – Ghaziabad Mainline Up",
            }
        ]
    }
