'use client';

import React, { useState, useRef } from 'react';
import {
  BrainCircuit,
  Camera,
  Clock,
  Gauge,
  ZoomIn,
  ZoomOut,
  Maximize2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  UserCheck,
  Upload,
  RefreshCw,
  Layers,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Flame,
} from 'lucide-react';
import { AI_DETECTIONS } from '@/lib/mockData';
import { AIDetection } from '@/lib/types';
import { runAIDetection } from '@/lib/aiService';

export default function AIDetectionPage() {
  const [selectedDetection, setSelectedDetection] = useState<AIDetection>(AI_DETECTIONS[0]);
  const [zoomLevel, setZoomLevel] = useState(145);
  const [showBoundingBox, setShowBoundingBox] = useState(true);
  const [showCrosshairs, setShowCrosshairs] = useState(true);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'scan' | 'batch' | 'model_info'>('scan');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(Math.max(prev + delta, 80), 250));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    const previewUrl = URL.createObjectURL(file);

    try {
      const response = await runAIDetection({
        file,
        fileUrl: previewUrl,
        sourceType: file.type.startsWith('video') ? 'video' : 'image',
        locationKm: 142.6,
        segmentCode: 'NDLS-S1A',
      });
      setSelectedDetection(response.detection);
      setActionSuccessMessage(`AI Analysis complete (${response.inferenceTimeMs}ms) • ${response.modelName}`);
      setTimeout(() => setActionSuccessMessage(null), 4000);
    } catch {
      setActionSuccessMessage('Inference completed with simulated diagnostic.');
      setTimeout(() => setActionSuccessMessage(null), 3000);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirm = () => {
    setSelectedDetection((prev) => ({ ...prev, status: 'confirmed' }));
    setActionSuccessMessage('Detection confirmed by Engineer. Work order logged.');
    setTimeout(() => setActionSuccessMessage(null), 3000);
  };

  const handleReject = () => {
    setSelectedDetection((prev) => ({ ...prev, status: 'rejected' }));
    setActionSuccessMessage('Detection marked as False Positive. Flagged for retraining.');
    setTimeout(() => setActionSuccessMessage(null), 3000);
  };

  const handleAssign = () => {
    setSelectedDetection((prev) => ({ ...prev, assignedEngineer: 'Er. Rajesh Sharma (SE/P-Way)' }));
    setActionSuccessMessage('Dispatched to Sr. Section Engineer Rajesh Sharma.');
    setTimeout(() => setActionSuccessMessage(null), 3000);
  };

  // 5-segment calculation
  const filledSegments = Math.floor(selectedDetection.confidence / 20);
  const remainderPct = ((selectedDetection.confidence % 20) / 20) * 100;
  const isHighConfidence = selectedDetection.confidence >= 75;

  return (
    <div className="space-y-4">
      {/* Top Header & Context Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#333A48]">
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-[#859399]">Division /</span>
          <span className="text-[#BBC9CF]">Delhi Division</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#333A48]" />
          <span className="text-[#00D1FF] font-bold">
            Inspection Scan: {selectedDetection.detectionCode}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*,video/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isAnalyzing}
            className="bg-[#00D1FF] hover:bg-[#4CD6FF] text-[#001F28] font-mono text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(0,209,255,0.25)]"
          >
            {isAnalyzing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Upload className="w-3.5 h-3.5" />
            )}
            <span>{isAnalyzing ? 'RUNNING INFERENCE...' : 'UPLOAD NEW SCAN'}</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert Banner */}
      {actionSuccessMessage && (
        <div className="p-3 bg-[#00A572]/20 border border-[#4EDEA3] rounded text-xs font-mono text-[#4EDEA3] flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Main Dual-Pane Studio Canvas */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 h-[calc(100vh-190px)] min-h-[640px]">
        {/* Left Viewport Pane (Spans 8 cols on xl) */}
        <section className="xl:col-span-8 surface-level-1 rounded-xl border border-[#333A48] overflow-hidden flex flex-col relative">
          {/* Viewport Toolbar */}
          <div className="h-11 bg-[#1E2024] border-b border-[#333A48] flex items-center justify-between px-3 lg:px-4 text-xs font-mono text-[#BBC9CF] z-20">
            <div className="flex items-center gap-3 lg:gap-5">
              <span className="flex items-center gap-1 text-[#E2E2E8]">
                <Camera className="w-3.5 h-3.5 text-[#00D1FF]" />
                <span className="hidden sm:inline">{selectedDetection.cameraRef}</span>
              </span>
              <span className="flex items-center gap-1 text-[#859399]">
                <Clock className="w-3.5 h-3.5" />
                <span>{selectedDetection.timestamp}</span>
              </span>
              <span className="flex items-center gap-1 text-[#4EDEA3]">
                <Gauge className="w-3.5 h-3.5" />
                <span>Speed: {selectedDetection.lineSpeedKmH} km/h</span>
              </span>
            </div>

            {/* Viewport Controls */}
            <div className="flex items-center bg-[#111317] border border-[#333A48] rounded overflow-hidden">
              <button
                onClick={() => handleZoom(-15)}
                className="px-2 py-1 hover:bg-[#333539] text-[#E2E2E8] border-r border-[#333A48]"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-2.5 py-1 text-[11px] font-bold text-[#A4E6FF]">{zoomLevel}%</span>
              <button
                onClick={() => handleZoom(15)}
                className="px-2 py-1 hover:bg-[#333539] text-[#E2E2E8] border-l border-[#333A48]"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setShowBoundingBox(!showBoundingBox)}
                className={`px-2 py-1 border-l border-[#333A48] ${
                  showBoundingBox ? 'text-[#00D1FF] bg-[#00D1FF]/10' : 'text-[#859399]'
                }`}
                title="Toggle Bounding Boxes"
              >
                <Layers className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* High-Resolution Inspection Canvas */}
          <div className="flex-1 bg-[#0A0A0A] relative overflow-hidden flex items-center justify-center cursor-crosshair">
            {/* Background Rail Inspection Photograph */}
            <div
              className="absolute inset-0 w-full h-full transition-transform duration-200"
              style={{
                backgroundImage: `url('${selectedDetection.imageUrl || AI_DETECTIONS[0].imageUrl}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transform: `scale(${zoomLevel / 100})`,
              }}
            />

            {/* Simulated Bounding Box Overlay */}
            {showBoundingBox && selectedDetection.boundingBox && (
              <div
                className="absolute border-2 border-[#EF4444] bg-[#EF4444]/15 animate-pulse z-10 transition-all"
                style={{
                  top: `${selectedDetection.boundingBox.y}%`,
                  left: `${selectedDetection.boundingBox.x}%`,
                  width: `${selectedDetection.boundingBox.width}%`,
                  height: `${selectedDetection.boundingBox.height}%`,
                  boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)',
                }}
              >
                {/* Defect Tag */}
                <div className="absolute -top-6 -left-0.5 bg-[#EF4444] text-[#FFFFFF] text-[10px] font-mono px-2 py-0.5 font-bold flex items-center gap-1 whitespace-nowrap shadow">
                  <AlertTriangle className="w-3 h-3 stroke-[2.5]" />
                  <span>{selectedDetection.boundingBox.label}</span>
                </div>

                {/* Precision Crosshairs */}
                {showCrosshairs && (
                  <>
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#EF4444]/60" />
                    <div className="absolute top-0 left-1/2 w-[1px] h-full bg-[#EF4444]/60" />
                  </>
                )}
              </div>
            )}

            {/* Floating Telemetry HUD Widget */}
            <div className="absolute bottom-3 left-3 bg-[#1E2024]/90 backdrop-blur-md border border-[#333A48] rounded-lg p-2.5 text-xs font-mono text-[#BBC9CF] shadow-xl z-20 space-y-1">
              <div className="flex justify-between gap-4 border-b border-[#333A48] pb-1">
                <span className="text-[#859399]">Coordinates:</span>
                <span className="text-[#E2E2E8] font-bold">
                  {selectedDetection.coordinates.lat}° N, {selectedDetection.coordinates.lng}° E
                </span>
              </div>
              <div className="flex justify-between gap-4 border-b border-[#333A48] pb-1">
                <span className="text-[#859399]">Segment / Track:</span>
                <span className="text-[#E2E2E8] font-bold">{selectedDetection.segmentCode}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[#859399]">Rail Head Temp:</span>
                <span className="text-[#4EDEA3] font-bold">{selectedDetection.ambientTempC}°C</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Analysis Side Panel (Spans 4 cols on xl) */}
        <aside className="xl:col-span-4 surface-level-1 rounded-xl border border-[#333A48] flex flex-col overflow-hidden h-full">
          {/* Panel Header */}
          <div className="p-4 border-b border-[#333A48] bg-[#1E2024]">
            <h2 className="text-base font-bold text-[#E2E2E8] mb-1.5 flex items-center justify-between">
              <span>AI Track Inspection Result</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00D1FF]/10 text-[#00D1FF] border border-[#00D1FF]/30 font-bold">
                DIAGNOSTIC
              </span>
            </h2>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 border px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase ${
                  selectedDetection.severity === 'critical'
                    ? 'bg-[#93000A] text-[#FFB4AB] border-[#FFB4AB]/40'
                    : 'bg-[#FFB044]/20 text-[#FFB044] border-[#FFB044]/40'
                }`}
              >
                <AlertTriangle className="w-3 h-3" />
                {selectedDetection.severity} Severity
              </span>
              <span className="text-[11px] font-mono text-[#859399]">
                Ref: {selectedDetection.detectionCode}
              </span>
            </div>
          </div>

          {/* Scrollable Diagnostic Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-mono">
            {/* Core Classification Specs */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-[#111317] rounded-lg border border-[#333A48]">
              <div>
                <p className="text-[11px] text-[#859399] mb-0.5">Detection Class</p>
                <p className="text-sm font-bold text-[#E2E2E8]">{selectedDetection.defectType}</p>
              </div>
              <div>
                <p className="text-[11px] text-[#859399] mb-0.5">Estimated Depth</p>
                <p className="text-sm font-bold text-[#E2E2E8]">
                  {selectedDetection.estimatedDepthMm ? `~${selectedDetection.estimatedDepthMm} mm` : 'Surface Level'}
                </p>
              </div>
            </div>

            {/* AI Confidence Meter */}
            <div className="p-3 bg-[#111317] rounded-lg border border-[#333A48] space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-[11px] text-[#BBC9CF]">AI Model Confidence</span>
                <span className="text-2xl font-bold font-sans text-[#00D1FF]">
                  {selectedDetection.confidence}%
                </span>
              </div>

              {/* 5-segment Progress Bar */}
              <div className="w-full bg-[#1E2024] h-2.5 rounded-full overflow-hidden flex gap-[2px] p-[1px] border border-[#333A48]">
                {[0, 1, 2, 3, 4].map((segIndex) => {
                  const isFull = segIndex < filledSegments;
                  const isPartial = segIndex === filledSegments;
                  const barColor = isHighConfidence ? 'bg-[#00D1FF]' : 'bg-[#FFB044]';

                  return (
                    <div
                      key={segIndex}
                      className="flex-1 bg-[#262B36] h-full relative overflow-hidden rounded-[1px]"
                    >
                      {isFull && <div className={`w-full h-full ${barColor}`} />}
                      {isPartial && (
                        <div className={`h-full ${barColor}`} style={{ width: `${remainderPct}%` }} />
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="text-[10px] text-right text-[#00D1FF]">
                {isHighConfidence
                  ? 'High Confidence (Human Verification Optional)'
                  : 'Requires Mandatory Field Engineer Verification'}
              </p>
            </div>

            {/* Transparent Reasoning Factors */}
            <div className="p-3 bg-[#111317] rounded-lg border border-[#333A48] space-y-2.5">
              <h4 className="text-[11px] text-[#BBC9CF] uppercase tracking-wider font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00D1FF]" />
                Transparent AI Reasoning
              </h4>
              <ul className="space-y-2 text-[#E2E2E8]">
                {selectedDetection.reasoningFactors.map((factor, idx) => (
                  <li key={idx} className="flex items-start gap-2 border-b border-[#333A48]/50 pb-2 last:border-0 last:pb-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00D1FF] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-[#E2E2E8]">{factor.title}</span>
                      <span className="text-[10px] text-[#859399]">{factor.description}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Safety Action */}
            <div className="p-3 bg-[#93000A]/20 border-l-4 border-l-[#EF4444] rounded border border-[#EF4444]/30 space-y-1">
              <h4 className="text-[11px] font-bold text-[#FFB4AB] uppercase">Recommended Action</h4>
              <p className="text-[11px] text-[#E2E2E8] leading-relaxed">
                {selectedDetection.recommendedAction}
              </p>
            </div>
          </div>

          {/* Actions Footer */}
          <div className="p-3 bg-[#111317] border-t border-[#333A48] space-y-2">
            <button
              onClick={handleAssign}
              className="w-full bg-[#00D1FF] hover:bg-[#4CD6FF] text-[#001F28] font-mono text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(0,209,255,0.2)] active:scale-[0.98]"
            >
              <UserCheck className="w-4 h-4 stroke-[2.5]" />
              <span>ASSIGN TRACK ENGINEER</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleConfirm}
                className="py-2 px-3 bg-[#00A572]/20 hover:bg-[#00A572]/40 text-[#4EDEA3] border border-[#4EDEA3]/40 rounded font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirm</span>
              </button>

              <button
                onClick={handleReject}
                className="py-2 px-3 bg-[#333539] hover:bg-[#3C494E] text-[#BBC9CF] border border-[#333A48] rounded font-mono text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <XCircle className="w-3.5 h-3.5 text-[#FFB4AB]" />
                <span>Reject</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
