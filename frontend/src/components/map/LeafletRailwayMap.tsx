'use client';

import React, { useEffect, useState } from 'react';
import { TRACK_SECTIONS, AI_DETECTIONS, SENSOR_DEVICES } from '@/lib/mockData';
import { TrackSection, AIDetection } from '@/lib/types';
import { Layers, MapPin, AlertTriangle, Radio, ShieldCheck } from 'lucide-react';

export default function LeafletRailwayMap() {
  const [isClient, setIsClient] = useState(false);
  const [selectedSection, setSelectedSection] = useState<TrackSection>(TRACK_SECTIONS[0]);
  const [selectedDefect, setSelectedDefect] = useState<AIDetection | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-full surface-level-1 flex items-center justify-center text-xs font-mono text-[#859399]">
        Initializing Geospatial Railway Map...
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col lg:flex-row gap-4">
      {/* Map Graphic Canvas */}
      <div className="flex-1 surface-level-1 rounded-xl border border-[#333A48] overflow-hidden relative min-h-[500px]">
        {/* Map Header Floating Overlay */}
        <div className="absolute top-4 left-4 z-20 glass-panel px-3 py-1.5 rounded text-xs font-mono flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#4EDEA3] animate-pulse" />
          <span className="text-[#E2E2E8] font-bold">Delhi Division Rail Topology</span>
          <span className="text-[#859399]">•</span>
          <span className="text-[#00D1FF]">5 Active Sections</span>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-20 glass-panel px-3 py-2 rounded text-xs font-mono flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-[#4EDEA3] rounded-full" />
            <span className="text-[#BBC9CF]">Optimal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-[#FFB044] rounded-full" />
            <span className="text-[#BBC9CF]">Warning</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-[#EF4444] rounded-full" />
            <span className="text-[#BBC9CF]">Critical</span>
          </div>
        </div>

        {/* Scaled High-Res Railway Topology Canvas */}
        <div className="w-full h-full bg-[#0C0E12] relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(#1E2024_1px,transparent_1px)] [background-size:20px_20px] opacity-60" />

          {/* SVG Multi-track network vector */}
          <svg className="w-full h-full absolute inset-0" viewBox="0 0 900 650">
            {/* Grid Coordinates markings */}
            <text x="30" y="40" fill="#333A48" fontSize="10" fontFamily="JetBrains Mono">LAT: 28.65°N • LON: 77.25°E</text>

            {/* DLI-UMB Route (Green) */}
            <path
              d="M 450 320 Q 340 220 220 90"
              stroke="#4EDEA3"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              className="cursor-pointer hover:stroke-width-6 transition-all"
              onClick={() => setSelectedSection(TRACK_SECTIONS[2])}
            />

            {/* NDLS-GZB Mainline (Critical Red) */}
            <path
              d="M 450 320 Q 580 300 750 220"
              stroke="#EF4444"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              className="cursor-pointer hover:stroke-width-6 transition-all filter drop-shadow-[0_0_10px_rgba(239,68,68,0.7)]"
              onClick={() => setSelectedSection(TRACK_SECTIONS[0])}
            />

            {/* NDLS-TKD Freight (Amber) */}
            <path
              d="M 450 320 Q 470 450 410 580"
              stroke="#FFB044"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              className="cursor-pointer hover:stroke-width-6 transition-all filter drop-shadow-[0_0_8px_rgba(255,176,68,0.6)]"
              onClick={() => setSelectedSection(TRACK_SECTIONS[1])}
            />

            {/* ANVR-MB Route (Green) */}
            <path
              d="M 450 320 Q 550 370 720 440"
              stroke="#4EDEA3"
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
              className="cursor-pointer hover:stroke-width-6 transition-all"
              onClick={() => setSelectedSection(TRACK_SECTIONS[3])}
            />

            {/* NZM-AGC Semi-High Speed Line (Green) */}
            <path
              d="M 450 320 Q 490 420 540 600"
              stroke="#4EDEA3"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              className="cursor-pointer hover:stroke-width-6 transition-all"
              onClick={() => setSelectedSection(TRACK_SECTIONS[4])}
            />

            {/* Stations */}
            <g>
              <circle cx="450" cy="320" r="9" fill="#111317" stroke="#00D1FF" strokeWidth="3" />
              <text x="450" y="345" fill="#00D1FF" fontSize="12" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="bold">
                NEW DELHI (NDLS)
              </text>

              <circle cx="750" cy="220" r="6" fill="#111317" stroke="#859399" strokeWidth="2" />
              <text x="750" y="240" fill="#BBC9CF" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">
                GHAZIABAD (GZB)
              </text>

              <circle cx="410" cy="580" r="6" fill="#111317" stroke="#859399" strokeWidth="2" />
              <text x="410" y="605" fill="#BBC9CF" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">
                TUGLAKABAD (TKD)
              </text>

              <circle cx="720" cy="440" r="6" fill="#111317" stroke="#859399" strokeWidth="2" />
              <text x="720" y="465" fill="#BBC9CF" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">
                ANAND VIHAR (ANVR)
              </text>

              <circle cx="220" cy="90" r="6" fill="#111317" stroke="#859399" strokeWidth="2" />
              <text x="220" y="80" fill="#BBC9CF" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">
                AMBALA LINE (UMB)
              </text>
            </g>
          </svg>

          {/* Interactive Critical Marker KM 142.6 */}
          <div
            className="absolute top-[37%] left-[68%] -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
            onClick={() => setSelectedDefect(AI_DETECTIONS[0])}
          >
            <div className="w-8 h-8 rounded-full bg-[#EF4444] animate-ping absolute opacity-75" />
            <div className="w-6 h-6 rounded-full border-2 border-[#EF4444] bg-[#111317] flex items-center justify-center relative shadow-[0_0_15px_#EF4444]">
              <AlertTriangle className="w-3 h-3 text-[#EF4444]" />
            </div>
            <div className="absolute top-7 left-1/2 -translate-x-1/2 bg-[#93000A] text-[#FFDAD6] border border-[#FFB4AB]/50 text-[10px] font-mono px-2 py-0.5 rounded whitespace-nowrap shadow-lg">
              KM 142.6 (TF-CRACK)
            </div>
          </div>
        </div>
      </div>

      {/* Side Details Panel (Spans 4 cols) */}
      <div className="w-full lg:w-96 surface-level-1 rounded-xl border border-[#333A48] p-5 space-y-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-[#333A48]">
            <h3 className="font-mono text-xs font-bold text-[#E2E2E8] uppercase">
              Section Intelligence
            </h3>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                selectedSection.status === 'critical'
                  ? 'bg-[#93000A] text-[#FFB4AB] border border-[#FFB4AB]/40'
                  : selectedSection.status === 'warning'
                  ? 'bg-[#FFB044]/20 text-[#FFB044]'
                  : 'bg-[#00A572]/20 text-[#4EDEA3]'
              }`}
            >
              {selectedSection.status}
            </span>
          </div>

          <div className="my-4 space-y-3 text-xs font-mono">
            <div>
              <span className="text-[#859399] block text-[10px]">CORRIDOR NAME</span>
              <span className="text-sm font-bold text-[#E2E2E8]">{selectedSection.name}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 bg-[#111317] rounded border border-[#333A48]">
                <span className="text-[#859399] block text-[10px]">HEALTH SCORE</span>
                <span className="text-base font-bold text-[#00D1FF]">{selectedSection.healthScore}%</span>
              </div>
              <div className="p-2.5 bg-[#111317] rounded border border-[#333A48]">
                <span className="text-[#859399] block text-[10px]">SPEED LIMIT</span>
                <span className="text-base font-bold text-[#E2E2E8]">{selectedSection.lineSpeedLimitKmH} km/h</span>
              </div>
            </div>

            <div className="p-3 bg-[#111317] rounded border border-[#333A48] space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-[#859399]">Rail Specification:</span>
                <span className="text-[#E2E2E8]">{selectedSection.railType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#859399]">Chainage:</span>
                <span className="text-[#E2E2E8]">KM {selectedSection.startKm} - {selectedSection.endKm}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#859399]">Sleepers Count:</span>
                <span className="text-[#E2E2E8]">{selectedSection.sleepersCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#859399]">Last Verified:</span>
                <span className="text-[#4EDEA3]">{selectedSection.lastInspected}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Defect Highlight if selected */}
        {selectedDefect && (
          <div className="p-3 bg-[#93000A]/20 border border-[#EF4444]/40 rounded-lg text-xs font-mono space-y-1">
            <span className="text-[10px] text-[#FFB4AB] font-bold uppercase block">Selected Anomaly Pin</span>
            <p className="text-[#E2E2E8] font-bold">{selectedDefect.defectType}</p>
            <p className="text-[#859399] text-[11px]">{selectedDefect.recommendedAction}</p>
          </div>
        )}
      </div>
    </div>
  );
}
