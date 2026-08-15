export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'routine';
export type TrackStatus = 'optimal' | 'warning' | 'critical';
export type AlertStatus = 'active' | 'acknowledged' | 'in_progress' | 'resolved';
export type InspectionStatus = 'scheduled' | 'in_progress' | 'completed' | 'overdue';
export type DeviceStatus = 'online' | 'warning' | 'offline';
export type UserRole = 'Chief Engineer' | 'Railway Engineer' | 'Safety Officer' | 'Field Inspector' | 'Admin';
export type TrainStatus = 'RUNNING' | 'DELAYED' | 'WARNING' | 'STOPPED';

export interface KPIData {
  trackNetworkKm: number;
  trackNetworkChangeKm: number;
  trackHealthPct: number;
  trackHealthStatus: 'STABLE' | 'DEGRADED' | 'CRITICAL';
  activeAlertsCount: number;
  criticalAlertsCount: number;
  aiDetectionsToday: number;
  aiDetectionsCapPct: number;
  maintenanceDueCount: number;
  openInspectionsCount: number;
  liveTrainsCount: number;
  runningTrainsCount: number;
  delayedTrainsCount: number;
  weatherCondition: string;
  weatherRiskScore: number;
}

export interface TrackSection {
  id: string;
  code: string;
  name: string;
  zone: string;
  division: string;
  startKm: number;
  endKm: number;
  healthScore: number;
  status: TrackStatus;
  coordinates: [number, number][];
  center: [number, number];
  railType: string;
  sleepersCount: number;
  lineSpeedLimitKmH: number;
  lastInspected: string;
  activeDefectsCount: number;
}

export interface ReasoningFactor {
  title: string;
  description: string;
  category: 'model_match' | 'trend' | 'sensor_correlation' | 'acoustic_signature';
  confidenceWeightPct: number;
}

export interface AIDetection {
  id: string;
  detectionCode: string;
  defectType: string;
  severity: Severity;
  confidence: number;
  trackSectionId: string;
  trackSectionName: string;
  locationKm: number;
  coordinates: { lat: number; lng: number };
  segmentCode: string;
  timestamp: string;
  cameraRef: string;
  lineSpeedKmH: number;
  ambientTempC: number;
  estimatedDepthMm?: number;
  imageUrl?: string;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
  };
  reasoningFactors: ReasoningFactor[];
  recommendedAction: string;
  status: 'pending_verification' | 'confirmed' | 'rejected' | 'maintenance_scheduled' | 'resolved';
  assignedEngineer?: string;
  notes?: string;
}

export interface Alert {
  id: string;
  alertCode: string;
  title: string;
  severity: Severity;
  trackSection: string;
  locationKm: number;
  detectionSource: string;
  timestamp: string;
  aiConfidence: number;
  status: AlertStatus;
  assignedEngineer: string;
  resolvedAt?: string;
  notes?: string;
}

export interface TrainApproachingAlert {
  alertId: string;
  trainNumber: string;
  trainName: string;
  defectId: string;
  defectType: string;
  locationKm: string;
  distanceKm: number;
  speedKmH: number;
  etaMinutes: number;
  etaFormatted: string;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  recommendedAction: string;
  timestamp: string;
}

export interface LiveTrain {
  id: string;
  trainNumber: string;
  trainName: string;
  latitude: number;
  longitude: number;
  speedKmH: number;
  direction: 'NORTHBOUND' | 'SOUTHBOUND' | 'EASTBOUND' | 'WESTBOUND';
  status: TrainStatus;
  currentStation: string;
  nextStation: string;
  delayMinutes: number;
  eta: string;
  lastUpdatedSec: number;
  route: string;
  nextStations: { name: string; eta: string }[];
  approachingAlert?: TrainApproachingAlert;
  dataSource: string;
}

export interface WeatherData {
  city: string;
  division: string;
  temperatureC: number;
  feelsLikeC: number;
  humidityPct: number;
  windSpeedKmh: number;
  windDirectionDeg: number;
  rainfallMm1h: number;
  visibilityKm: number;
  pressureHpa: number;
  condition: string;
  conditionIcon: string;
  weatherRiskScore: number;
  weatherRiskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  drainageRisk: string;
  bucklingRisk: string;
  catenaryRisk: string;
  visibilityRisk: string;
  trackImpactSummary: string;
  lastUpdated: string;
  dataSource: string;
}

export interface WeatherForecastItem {
  time: string;
  temperatureC: number;
  condition: string;
  rainfallMm: number;
  riskScore: number;
}

export interface PredictiveRisk {
  id: string;
  riskTitle: string;
  component: string;
  trackSection: string;
  locationKm: string;
  failureProbability: number;
  baseRiskPct: number;
  weatherImpactPct: number;
  weatherCondition: string;
  expectedWindowDays: string;
  contributingFactors: {
    factor: string;
    value: string;
    impact: 'critical' | 'high' | 'medium';
  }[];
  forecastCurve: {
    day: string;
    riskScore: number;
    threshold: number;
  }[];
  recommendedMaintenance: string;
  priority: Severity;
  status: 'monitoring' | 'work_order_created' | 'dispatched' | 'remediated';
}

export interface Inspection {
  id: string;
  inspectionCode: string;
  trackSection: string;
  inspectorName: string;
  inspectorRole: string;
  date: string;
  timeSlot: string;
  status: InspectionStatus;
  vehicleType: string;
  defectsFound: number;
  criticalCount: number;
  notes: string;
  complianceScorePct: number;
}

export interface DeviceSensor {
  id: string;
  deviceCode: string;
  name: string;
  type: 'acoustic' | 'accelerometer' | 'dts_fiber' | 'cctv_ir' | 'gps_trolley' | 'optical_scanner';
  location: string;
  trackKm: number;
  status: DeviceStatus;
  batteryPct: number;
  signalStrengthDbm: number;
  lastCommunicationSec: number;
  sampleRateHz: number;
  telemetry: {
    vibrationG?: number;
    temperatureC?: number;
    strainMicrostrain?: number;
    voltageV?: number;
  };
}

export interface ReportItem {
  id: string;
  title: string;
  reportType: 'daily_safety' | 'track_health' | 'ai_detection' | 'predictive_maintenance' | 'incident' | 'inspection';
  division: string;
  period: string;
  generatedAt: string;
  generatedBy: string;
  fileFormat: 'PDF' | 'CSV' | 'JSON';
  fileSizeMb: number;
  summaryMetrics: {
    inspectionsCompleted?: number;
    defectsIdentified?: number;
    criticalAlerts?: number;
    averageHealthScore?: number;
  };
}
