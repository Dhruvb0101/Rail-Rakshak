'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Network,
  Layers,
  Train,
  AlertTriangle,
  CloudRain,
  Activity,
  Radio,
  Eye,
  Info,
  Maximize2,
  CheckSquare,
  Square,
} from 'lucide-react';
import { TRACK_SECTIONS, AI_DETECTIONS, LIVE_TRAINS } from '@/lib/mockData';
import { TrackSection, AIDetection, LiveTrain } from '@/lib/types';

// Dynamically import Interactive Leaflet Map (SSR Disabled)
const InteractiveTrainMap = dynamic(
  () => import('@/components/map/InteractiveTrainMap').then((mod) => mod.InteractiveTrainMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full surface-level-1 flex items-center justify-center text-xs font-mono text-[#859399]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00D1FF] animate-ping" />
          <span>Loading Unified Situational Awareness Map...</span>
        </div>
      </div>
    ),
  }
);

export default function UnifiedNetworkMapPage() {
  const [layers, setLayers] = useState({
    tracks: true,
    trains: true,
    defects: true,
    alerts: true,
    weather: true,
    health: true,
  });

  const [selectedTrain, setSelectedTrain] = useState<LiveTrain>(LIVE_TRAINS[0]);
  const [selectedDefect, setSelectedDefect] = useState<AIDetection | null>(AI_DETECTIONS[0]);

  const toggleLayer = (layerKey: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#333A48]">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#E2E2E8] tracking-tight flex items-center gap-2">
            <Network className="w-6 h-6 text-[#00D1FF]" />
            <span>Unified Railway Situational Awareness Map</span>
          </h1>
          <p className="text-xs lg:text-sm font-mono text-[#859399] mt-0.5">
            Geospatial synthesis of Live Train Symbols + Animated Route Paths + AI Track Defects + Weather Risk.
          </p>
        </div>

        {/* Layer Toggles Bar */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono bg-[#1E2024] p-1.5 rounded-lg border border-[#333A48]">
          <button
            onClick={() => toggleLayer('trains')}
            className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors ${
              layers.trains ? 'bg-[#4EDEA3]/20 text-[#4EDEA3] border border-[#4EDEA3]/30 font-bold' : 'text-[#859399]'
            }`}
          >
            {layers.trains ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
            <span>Train Symbols & Paths</span>
          </button>

          <button
            onClick={() => toggleLayer('defects')}
            className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors ${
              layers.defects ? 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30 font-bold' : 'text-[#859399]'
            }`}
          >
            {layers.defects ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
            <span>AI Defects</span>
          </button>

          <button
            onClick={() => toggleLayer('weather')}
            className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors ${
              layers.weather ? 'bg-[#FFB044]/20 text-[#FFB044] border border-[#FFB044]/30 font-bold' : 'text-[#859399]'
            }`}
          >
            {layers.weather ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
            <span>Weather Risk Zone</span>
          </button>
        </div>
      </div>

      {/* Main Dual-Pane: Interactive GIS Map + Tactical Telemetry HUD */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 h-[calc(100vh-210px)] min-h-[600px]">
        {/* Left Interactive Map Canvas (8 cols on xl) */}
        <section className="xl:col-span-8 surface-level-1 rounded-xl border border-[#333A48] overflow-hidden flex flex-col relative">
          <InteractiveTrainMap
            trains={layers.trains ? LIVE_TRAINS : []}
            selectedTrain={selectedTrain}
            onSelectTrain={(t) => {
              setSelectedTrain(t);
              setSelectedDefect(null);
            }}
            onSelectDefect={(d) => setSelectedDefect(d)}
            showWeatherLayer={layers.weather}
          />
        </section>

        {/* Right Tactical Telemetry HUD (4 cols on xl) */}
        <aside className="xl:col-span-4 surface-level-1 rounded-xl border border-[#333A48] flex flex-col overflow-hidden h-full">
          <div className="p-4 border-b border-[#333A48] bg-[#1E2024]">
            <h2 className="text-sm font-bold text-[#E2E2E8] font-mono uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#00D1FF]" />
              Tactical Telemetry Inspector
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-mono">
            {selectedTrain && (
              <div className="space-y-3">
                <div className="p-3 bg-[#111317] rounded-lg border border-[#00D1FF]/40 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[#859399]">Train:</span>
                    <span className="text-[#00D1FF] font-bold">
                      {selectedTrain.trainNumber} ({selectedTrain.trainName})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#859399]">Speed:</span>
                    <span className="text-[#4EDEA3] font-bold">{selectedTrain.speedKmH} km/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#859399]">Live Coordinates:</span>
                    <span className="text-[#E2E2E8] font-bold">
                      {selectedTrain.latitude}° N, {selectedTrain.longitude}° E
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#859399]">Route Corridor:</span>
                    <span className="text-[#BBC9CF]">{selectedTrain.route}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#859399]">Status:</span>
                    <span className="text-[#FFB4AB] font-bold">{selectedTrain.status}</span>
                  </div>
                </div>

                {selectedTrain.approachingAlert && (
                  <div className="p-3 bg-[#93000A]/30 border border-[#EF4444] rounded-lg space-y-1">
                    <span className="text-[10px] font-bold text-[#FFB4AB] uppercase block">
                      ⚠ CRITICAL DEFECT PROXIMITY ALERT
                    </span>
                    <p className="text-[11px] text-[#E2E2E8] font-bold">
                      {selectedTrain.approachingAlert.defectType} ({selectedTrain.approachingAlert.locationKm})
                    </p>
                    <p className="text-[10px] text-[#BBC9CF]">
                      Distance: <span className="text-[#FFB4AB] font-bold">{selectedTrain.approachingAlert.distanceKm} km</span> • ETA: <span className="text-[#FFB4AB] font-bold">{selectedTrain.approachingAlert.etaFormatted}</span>
                    </p>
                  </div>
                )}
              </div>
            )}

            {selectedDefect && (
              <div className="p-3 bg-[#111317] rounded-lg border border-[#EF4444]/40 space-y-1.5">
                <span className="text-[10px] text-[#FFB4AB] uppercase font-bold block">
                  Track Defect Telemetry Pin
                </span>
                <div className="flex justify-between">
                  <span className="text-[#859399]">Defect ID:</span>
                  <span className="text-[#EF4444] font-bold">{selectedDefect.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#859399]">Type:</span>
                  <span className="text-[#E2E2E8] font-bold">{selectedDefect.defectType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#859399]">AI Confidence:</span>
                  <span className="text-[#00D1FF] font-bold">{selectedDefect.confidence}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#859399]">Location:</span>
                  <span className="text-[#BBC9CF]">KM {selectedDefect.locationKm} ({selectedDefect.segmentCode})</span>
                </div>
              </div>
            )}

            {/* Division Health Snapshot */}
            <div className="p-3 bg-[#111317] rounded-lg border border-[#333A48] space-y-2">
              <span className="text-[10px] text-[#859399] uppercase font-bold block">
                Corridor Track Health Index
              </span>
              {TRACK_SECTIONS.map((sec) => (
                <div key={sec.id} className="flex items-center justify-between text-[11px]">
                  <span className="text-[#BBC9CF] truncate max-w-[180px]">{sec.name}</span>
                  <span
                    className={`font-bold ${
                      sec.status === 'optimal'
                        ? 'text-[#4EDEA3]'
                        : sec.status === 'warning'
                        ? 'text-[#FFB044]'
                        : 'text-[#EF4444]'
                    }`}
                  >
                    {sec.healthScore}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
