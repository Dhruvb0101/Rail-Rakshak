from typing import Optional, List, Dict, Any
from pydantic import BaseModel

# ----------------- AI & Defect Schemas -----------------
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

# ----------------- Alert Schemas -----------------
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

# ----------------- Live Train Tracking Schemas -----------------
class TrainApproachingAlertSchema(BaseModel):
    alertId: str
    trainNumber: str
    trainName: str
    defectId: str
    defectType: str
    locationKm: str
    distanceKm: float
    speedKmH: float
    etaMinutes: float
    etaFormatted: str
    riskLevel: str  # CRITICAL | HIGH | MEDIUM | LOW
    recommendedAction: str
    timestamp: str

class LiveTrainSchema(BaseModel):
    id: str
    trainNumber: str
    trainName: str
    latitude: float
    longitude: float
    speedKmH: float
    direction: str  # NORTHBOUND | SOUTHBOUND | EASTBOUND | WESTBOUND
    status: str     # RUNNING | DELAYED | WARNING | STOPPED
    currentStation: str
    nextStation: str
    delayMinutes: int
    eta: str
    lastUpdatedSec: int
    route: str
    nextStations: List[Dict[str, str]]
    approachingAlert: Optional[TrainApproachingAlertSchema] = None
    dataSource: str # RAILRADAR_LIVE | SIMULATION_FALLBACK

# ----------------- Weather Intelligence Schemas -----------------
class WeatherCurrentSchema(BaseModel):
    city: str
    division: str
    temperatureC: float
    feelsLikeC: float
    humidityPct: int
    windSpeedKmh: float
    windDirectionDeg: int
    rainfallMm1h: float
    visibilityKm: float
    pressureHpa: int
    condition: str
    conditionIcon: str
    weatherRiskScore: int  # 0 to 100
    weatherRiskLevel: str  # LOW | MODERATE | HIGH | CRITICAL
    drainageRisk: str
    bucklingRisk: str
    catenaryRisk: str
    visibilityRisk: str
    trackImpactSummary: str
    lastUpdated: str
    dataSource: str        # OPENWEATHER_LIVE | SIMULATION_FALLBACK

class WeatherForecastItemSchema(BaseModel):
    time: str
    temperatureC: float
    condition: str
    rainfallMm: float
    riskScore: int

# ----------------- KPI & Work Orders -----------------
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
    liveTrainsCount: int
    runningTrainsCount: int
    delayedTrainsCount: int
    weatherCondition: str
    weatherRiskScore: int

class WorkOrderCreateRequest(BaseModel):
    riskId: str
    targetDate: str
    assignedGang: str
    remediationProtocol: str
