from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class ReasoningFactorSchema(BaseModel):
    title: str
    description: str
    category: str
    confidenceWeightPct: float

class BoundingBoxSchema(BaseModel):
    x: float
    y: float
    width: float
    height: float
    label: str

class DetectionCreateRequest(BaseModel):
    sourceType: str = "image"
    locationKm: float = 142.6
    segmentCode: str = "NDLS-S1A"
    cameraType: Optional[str] = "Cam-04 (High-Res IR)"
    imageUrl: Optional[str] = None

class DetectionResponse(BaseModel):
    id: str
    detectionCode: str
    defectType: str
    severity: str
    confidence: float
    trackSectionId: str
    trackSectionName: str
    locationKm: float
    coordinates: Dict[str, float]
    segmentCode: str
    timestamp: str
    cameraRef: str
    lineSpeedKmH: float
    ambientTempC: float
    estimatedDepthMm: Optional[float] = None
    imageUrl: Optional[str] = None
    boundingBox: Optional[BoundingBoxSchema] = None
    reasoningFactors: List[ReasoningFactorSchema]
    recommendedAction: str
    status: str
    assignedEngineer: Optional[str] = None
    notes: Optional[str] = None

class AnalysisResultResponse(BaseModel):
    detection: DetectionResponse
    inferenceTimeMs: int
    modelName: str
    modelVersion: str

class AlertSchema(BaseModel):
    id: str
    alertCode: str
    title: str
    severity: str
    trackSection: str
    locationKm: float
    detectionSource: str
    timestamp: str
    aiConfidence: float
    status: str
    assignedEngineer: Optional[str] = None

class AlertUpdateRequest(BaseModel):
    status: Optional[str] = None
    assignedEngineer: Optional[str] = None
    severity: Optional[str] = None

class KPISummaryResponse(BaseModel):
    trackNetworkKm: float
    trackNetworkChangeKm: float
    trackHealthPct: float
    trackHealthStatus: str
    activeAlertsCount: int
    criticalAlertsCount: int
    aiDetectionsToday: int
    aiDetectionsCapPct: int
    maintenanceDueCount: int
    openInspectionsCount: int

class WorkOrderCreateRequest(BaseModel):
    riskId: str
    targetDate: str
    assignedGang: str
    remediationProtocol: str
