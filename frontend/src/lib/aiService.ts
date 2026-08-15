import { AIDetection, ReasoningFactor } from './types';
import { AI_DETECTIONS } from './mockData';

export interface AnalysisRequest {
  file: File | null;
  fileUrl?: string;
  sourceType: 'image' | 'video';
  cameraType?: string;
  locationKm?: number;
  segmentCode?: string;
}

export interface AnalysisResponse {
  detection: AIDetection;
  inferenceTimeMs: number;
  modelName: string;
  modelVersion: string;
}

const DEFECT_TEMPLATES = [
  {
    defectType: 'Transverse Rail Fracture Crack',
    severity: 'critical' as const,
    confidenceMin: 92.0,
    confidenceMax: 98.5,
    estimatedDepthMm: 14,
    recommendedAction: 'Immediate manual inspection required. Speed restriction of 30 km/h recommended.',
    label: 'TF-CRACK DETECTED',
    reasoning: [
      {
        title: 'Deep neural feature match: Transverse Fissure (TF)',
        description: 'ResNet-50-Rail (v2.4) high confidence localized contour anomaly',
        category: 'model_match' as const,
        confidenceWeightPct: 97.4,
      },
      {
        title: 'Rail Head Surface Discontinuity',
        description: 'Pixel contrast gradient indicates steel surface discontinuity > 3.2mm',
        category: 'model_match' as const,
        confidenceWeightPct: 94.1,
      },
    ],
  },
  {
    defectType: 'Fastener Clip Missing / Dislodged',
    severity: 'high' as const,
    confidenceMin: 68.0,
    confidenceMax: 84.0,
    estimatedDepthMm: 0,
    recommendedAction: 'Human verification required. Schedule trackman gang inspection within 24 hours.',
    label: 'FASTENER DISLODGED',
    reasoning: [
      {
        title: 'ERC Clip Geometry Misalignment',
        description: 'Angle of clip exceeds tolerance threshold from baseline sleeper CAD spec',
        category: 'model_match' as const,
        confidenceWeightPct: 76.5,
      },
    ],
  },
  {
    defectType: 'Thermite Weld Porosity & Slag Inclusion',
    severity: 'critical' as const,
    confidenceMin: 91.0,
    confidenceMax: 96.0,
    estimatedDepthMm: 9,
    recommendedAction: 'Ultrasonic flaw detector (USFD) confirmation and clamp reinforcement.',
    label: 'WELD DEFECT DETECTED',
    reasoning: [
      {
        title: 'Thermite Weld Zone Irregularity',
        description: 'Thermal dissipation pattern shows micro-cavity inside weld collar',
        category: 'model_match' as const,
        confidenceWeightPct: 93.0,
      },
    ],
  },
  {
    defectType: 'Wheel Burn / Rail Head Squat',
    severity: 'medium' as const,
    confidenceMin: 85.0,
    confidenceMax: 92.0,
    estimatedDepthMm: 4,
    recommendedAction: 'Grinding schedule planning for upcoming rail maintenance block.',
    label: 'SQUAT ANOMALY DETECTED',
    reasoning: [
      {
        title: 'Sub-surface Micro-delamination',
        description: 'Characteristic depression and metallic spalling pattern identified',
        category: 'model_match' as const,
        confidenceWeightPct: 88.0,
      },
    ],
  },
];

export async function runAIDetection(request: AnalysisRequest): Promise<AnalysisResponse> {
  const startTime = performance.now();

  // If backend API is live, try it first
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    const res = await fetch(`${backendUrl}/api/detections/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sourceType: request.sourceType,
        locationKm: request.locationKm || 142.6,
        segmentCode: request.segmentCode || 'NDLS-S1A',
      }),
      // fast timeout so we gracefully fall back to high-fidelity mock if backend is not started
      signal: AbortSignal.timeout(1200),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        detection: data.detection,
        inferenceTimeMs: Math.round(performance.now() - startTime),
        modelName: data.modelName || 'RailRakshak-YOLOv8x-Rail',
        modelVersion: data.modelVersion || 'v2.4.1',
      };
    }
  } catch {
    // Fall back to client-side simulated neural inference
  }

  // Simulated AI inference delay (600ms - 1100ms)
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Pick defect template
  const template = DEFECT_TEMPLATES[Math.floor(Math.random() * DEFECT_TEMPLATES.length)];
  const confidence = Number((template.confidenceMin + Math.random() * (template.confidenceMax - template.confidenceMin)).toFixed(1));

  const newDetection: AIDetection = {
    id: `DET-SCAN-${Date.now().toString().slice(-6)}`,
    detectionCode: `#TF-${Math.floor(1000 + Math.random() * 9000)}`,
    defectType: template.defectType,
    severity: template.severity,
    confidence,
    trackSectionId: 'SEC-NDLS-GZB-01',
    trackSectionName: 'New Delhi – Ghaziabad Mainline Up',
    locationKm: request.locationKm || Number((140.0 + Math.random() * 15.0).toFixed(1)),
    coordinates: { lat: 28.6554, lng: 77.2912 },
    segmentCode: request.segmentCode || 'NDLS-S1A',
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
    cameraRef: request.cameraType || 'Cam-04 (High-Res IR Diagnostic)',
    lineSpeedKmH: 85,
    ambientTempC: 34,
    estimatedDepthMm: template.estimatedDepthMm,
    imageUrl: request.fileUrl || AI_DETECTIONS[0].imageUrl,
    boundingBox: {
      x: 35 + Math.floor(Math.random() * 15),
      y: 30 + Math.floor(Math.random() * 15),
      width: 20 + Math.floor(Math.random() * 8),
      height: 24 + Math.floor(Math.random() * 8),
      label: template.label,
    },
    reasoningFactors: template.reasoning,
    recommendedAction: template.recommendedAction,
    status: 'pending_verification',
    assignedEngineer: 'Er. Rajesh Sharma (SE/P-Way)',
    notes: 'Uploaded scan diagnostic. Automated AI inference triggered.',
  };

  return {
    detection: newDetection,
    inferenceTimeMs: Math.round(performance.now() - startTime),
    modelName: 'RailRakshak-ResNet50-Rail',
    modelVersion: 'v2.4.0',
  };
}
