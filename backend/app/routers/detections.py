from fastapi import APIRouter
from app.schemas.all_schemas import DetectionCreateRequest, AnalysisResultResponse
from app.services.ai_inference import ai_pipeline
from app.core.supabase import fetch_all, insert_record

router = APIRouter(prefix="/detections", tags=["Detections"])

# Fallback detection data when Supabase is unavailable
FALLBACK_DETECTIONS = [
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


@router.post("/analyze", response_model=AnalysisResultResponse)
async def analyze_defect(request: DetectionCreateRequest):
    """Run AI inference and persist the result to Supabase."""
    result = ai_pipeline.analyze_scan(request)

    # Persist to Supabase if available
    det = result.detection
    await insert_record("detections", {
        "id": det.id,
        "detection_code": det.detectionCode,
        "defect_type": det.defectType,
        "severity": det.severity,
        "confidence": det.confidence,
        "track_section_id": det.trackSectionId,
        "track_section_name": det.trackSectionName,
        "location_km": det.locationKm,
        "coordinates": det.coordinates,
        "segment_code": det.segmentCode,
        "camera_ref": det.cameraRef,
        "line_speed_kmh": det.lineSpeedKmH,
        "ambient_temp_c": det.ambientTempC,
        "estimated_depth_mm": det.estimatedDepthMm,
        "image_url": det.imageUrl,
        "bounding_box": det.boundingBox.dict() if det.boundingBox else None,
        "reasoning_factors": [rf.dict() for rf in det.reasoningFactors],
        "recommended_action": det.recommendedAction,
        "status": det.status,
        "assigned_engineer": det.assignedEngineer,
        "notes": det.notes,
    })

    return result


@router.get("/")
async def list_detections():
    """List detections from Supabase; fallback to demo data."""
    rows = await fetch_all("detections", order_by="created_at", limit=50)
    if rows:
        items = []
        for row in rows:
            items.append({
                "id": row.get("id"),
                "detectionCode": row.get("detection_code"),
                "defectType": row.get("defect_type"),
                "severity": row.get("severity"),
                "confidence": row.get("confidence"),
                "locationKm": row.get("location_km"),
                "trackSection": row.get("track_section_name"),
            })
        return {"status": "success", "total": len(items), "items": items}
    return {"status": "success", "total": 1, "items": FALLBACK_DETECTIONS}
