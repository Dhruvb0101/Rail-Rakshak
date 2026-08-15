'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  ZoomIn,
  ZoomOut,
  Search,
  Maximize2,
  AlertTriangle,
  Radio,
  MapPin,
  X,
  ArrowUpRight,
} from 'lucide-react';
import { TRACK_SECTIONS } from '@/lib/mockData';
import { TrackSection } from '@/lib/types';

export function LiveMapWidget() {
  const [selectedSection, setSelectedSection] = useState<TrackSection | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeLayer, setActiveLayer] = useState<'all' | 'critical' | 'sensors'>('all');

  return (
    <div className="surface-level-1 rounded-lg overflow-hidden relative border border-[#333A48] flex flex-col h-[520px] lg:h-[600px] w-full">
      {/* Top Left: Live Telemetry Badge */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <div className="glass-panel px-3 py-1.5 rounded flex items-center gap-2 text-xs font-mono text-[#E2E2E8]">
          <span className="w-2 h-2 rounded-full bg-[#4EDEA3] animate-pulse" />
          <span className="font-bold">Live Network Telemetry</span>
          <span className="text-[#859399]">|</span>
          <span className="text-[#00D1FF]">Delhi Hub</span>
        </div>
      </div>

      {/* Top Right: Map Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <div className="glass-panel rounded flex flex-col overflow-hidden">
          <button
            onClick={() => setZoomLevel((prev) => Math.min(prev + 0.15, 1.5))}
            className="p-2 hover:bg-[#333539] text-[#E2E2E8] border-b border-[#333A48] transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((prev) => Math.max(prev - 0.15, 0.8))}
            className="p-2 hover:bg-[#333539] text-[#E2E2E8] transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => setActiveLayer((prev) => (prev === 'all' ? 'critical' : 'all'))}
          className={`glass-panel p-2 rounded hover:bg-[#333539] transition-colors ${
            activeLayer === 'critical' ? 'text-[#FFB4AB] border-[#FFB4AB]/50' : 'text-[#E2E2E8]'
          }`}
          title="Toggle Critical Filter"
        >
          <Layers className="w-4 h-4" />
        </button>

        <Link
          href="/network"
          className="glass-panel p-2 rounded hover:bg-[#333539] text-[#00D1FF] transition-colors"
          title="Open Full Geospatial View"
        >
          <Maximize2 className="w-4 h-4" />
        </Link>
      </div>

      {/* Bottom Left: Safety Legend */}
      <div className="absolute bottom-4 left-4 z-20 glass-panel px-3 py-2 rounded flex items-center gap-4 text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="w-3 h-1 bg-[#4EDEA3] rounded-full shadow-[0_0_6px_#4EDEA3]" />
          <span className="text-[#BBC9CF]">Optimal (&gt;90%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-1 bg-[#FFB044] rounded-full shadow-[0_0_6px_#FFB044]" />
          <span className="text-[#BBC9CF]">Warning (75-90%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-1 bg-[#EF4444] rounded-full shadow-[0_0_6px_#EF4444]" />
          <span className="text-[#BBC9CF]">Critical (&lt;75%)</span>
        </div>
      </div>

      {/* Radar Map Graphic Viewport */}
      <div
        className="w-full h-full bg-[#0C0E12] relative overflow-hidden flex items-center justify-center select-none"
        style={{
          transform: `scale(${zoomLevel})`,
          transition: 'transform 0.25s ease-out',
        }}
      >
        {/* Background Grid & SVG Railway Track Vectors */}
        <div className="absolute inset-0 bg-[radial-gradient(#1E2024_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />

        {/* Abstract Topographic Delhi Network Graphic */}
        <svg className="w-full h-full absolute inset-0 text-white" viewBox="0 0 800 600">
          <defs>
            <linearGradient id="optGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4EDEA3" />
              <stop offset="100%" stopColor="#00A572" />
            </linearGradient>
            <linearGradient id="critGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#93000A" />
            </linearGradient>
            <linearGradient id="warnGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFB044" />
              <stop offset="100%" stopColor="#FF8C00" />
            </linearGradient>
          </defs>

          {/* DLI-UMB Route (Green) */}
          <path
            d="M 400 300 Q 320 200 240 80"
            stroke="url(#optGrad)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            className="cursor-pointer hover:stroke-width-6 transition-all"
            onClick={() => setSelectedSection(TRACK_SECTIONS[2])}
          />

          {/* NDLS-GZB Mainline (Critical Red Section at KM 142) */}
          <path
            d="M 400 300 Q 520 280 660 220"
            stroke="url(#critGrad)"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            className="cursor-pointer hover:stroke-width-6 transition-all filter drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]"
            onClick={() => setSelectedSection(TRACK_SECTIONS[0])}
          />

          {/* NDLS-TKD Freight (Amber Warning Section) */}
          <path
            d="M 400 300 Q 420 420 380 540"
            stroke="url(#warnGrad)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            className="cursor-pointer hover:stroke-width-6 transition-all filter drop-shadow-[0_0_6px_rgba(255,176,68,0.5)]"
            onClick={() => setSelectedSection(TRACK_SECTIONS[1])}
          />

          {/* ANVR-MB Fast Line (Green) */}
          <path
            d="M 400 300 Q 480 340 620 400"
            stroke="url(#optGrad)"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
            className="cursor-pointer"
            onClick={() => setSelectedSection(TRACK_SECTIONS[3])}
          />

          {/* Station Junction Nodes */}
          <g>
            {/* New Delhi Junction (Central Hub) */}
            <circle cx="400" cy="300" r="8" fill="#00D1FF" className="animate-ping opacity-40" />
            <circle cx="400" cy="300" r="7" fill="#111317" stroke="#00D1FF" strokeWidth="3" />
            <text x="400" y="325" fill="#A4E6FF" fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="bold">
              NDLS (CENTRAL)
            </text>

            {/* Ghaziabad Junction */}
            <circle cx="660" cy="220" r="5" fill="#111317" stroke="#859399" strokeWidth="2" />
            <text x="660" y="240" fill="#BBC9CF" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">
              GZB JUNCTION
            </text>

            {/* Old Delhi Junction */}
            <circle cx="370" cy="260" r="5" fill="#111317" stroke="#859399" strokeWidth="2" />
            <text x="340" y="255" fill="#BBC9CF" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">
              DLI MAIN
            </text>

            {/* Tuglakabad Freight Terminal */}
            <circle cx="380" cy="540" r="5" fill="#111317" stroke="#859399" strokeWidth="2" />
            <text x="380" y="560" fill="#BBC9CF" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">
              TKD YARD
            </text>

            {/* Ambala Line Exit */}
            <circle cx="240" cy="80" r="5" fill="#111317" stroke="#859399" strokeWidth="2" />
            <text x="240" y="65" fill="#BBC9CF" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">
              UMB CORRIDOR
            </text>
          </g>
        </svg>

        {/* Dynamic Critical Pin at KM 142.6 (NDLS-GZB) */}
        <div
          className="absolute top-[42%] left-[64%] -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
          onClick={() => setSelectedSection(TRACK_SECTIONS[0])}
        >
          <div className="w-7 h-7 rounded-full bg-[#EF4444] animate-ping absolute opacity-75" />
          <div className="w-5 h-5 rounded-full border-2 border-[#EF4444] bg-[#111317] flex items-center justify-center relative z-10 shadow-[0_0_12px_#EF4444]">
            <AlertTriangle className="w-2.5 h-2.5 text-[#EF4444]" />
          </div>
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-[#93000A] text-[#FFDAD6] border border-[#FFB4AB]/40 text-[10px] font-mono px-2 py-0.5 rounded shadow-lg whitespace-nowrap group-hover:scale-110 transition-transform">
            KM 142.6 (CRITICAL)
          </div>
        </div>

        {/* Dynamic Warning Pin at KM 88.2 (TKD Yard) */}
        <div
          className="absolute top-[68%] left-[51%] -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
          onClick={() => setSelectedSection(TRACK_SECTIONS[1])}
        >
          <div className="w-4 h-4 rounded-full border-2 border-[#FFB044] bg-[#111317] flex items-center justify-center relative z-10 shadow-[0_0_8px_#FFB044]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FFB044]" />
          </div>
          <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-[#262B36] text-[#FFB044] border border-[#FFB044]/40 text-[9px] font-mono px-1.5 py-0.5 rounded shadow whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            KM 88.2 (WARNING)
          </div>
        </div>
      </div>

      {/* Track Section Details Popup Card */}
      {selectedSection && (
        <div className="absolute bottom-16 right-4 z-30 w-80 bg-[#1A1D24] border border-[#333A48] rounded-lg p-4 shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-start justify-between pb-2 border-b border-[#333A48]">
            <div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                  selectedSection.status === 'critical'
                    ? 'bg-[#93000A] text-[#FFB4AB] border border-[#FFB4AB]/30'
                    : selectedSection.status === 'warning'
                    ? 'bg-[#FFB044]/20 text-[#FFB044]'
                    : 'bg-[#00A572]/20 text-[#4EDEA3]'
                }`}
              >
                {selectedSection.status} • {selectedSection.healthScore}%
              </span>
              <h4 className="text-xs font-bold text-[#E2E2E8] mt-1.5">{selectedSection.name}</h4>
              <p className="text-[10px] font-mono text-[#859399]">
                Code: {selectedSection.code} • KM {selectedSection.startKm} - {selectedSection.endKm}
              </p>
            </div>
            <button
              onClick={() => setSelectedSection(null)}
              className="text-[#859399] hover:text-[#E2E2E8]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 my-3 text-[11px] font-mono">
            <div className="p-2 bg-[#111317] rounded border border-[#333A48]">
              <span className="text-[#859399] block text-[9px]">SPEED LIMIT</span>
              <span className="text-[#E2E2E8] font-bold">{selectedSection.lineSpeedLimitKmH} km/h</span>
            </div>
            <div className="p-2 bg-[#111317] rounded border border-[#333A48]">
              <span className="text-[#859399] block text-[9px]">ACTIVE DEFECTS</span>
              <span
                className={
                  selectedSection.activeDefectsCount > 0
                    ? 'text-[#FFB4AB] font-bold'
                    : 'text-[#4EDEA3] font-bold'
                }
              >
                {selectedSection.activeDefectsCount} defects
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/ai-detection?section=${selectedSection.id}`}
              className="flex-1 bg-[#00D1FF] hover:bg-[#4CD6FF] text-[#001F28] text-[11px] font-mono font-bold py-1.5 rounded flex items-center justify-center gap-1 transition-all"
            >
              <span>AI Inspection</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/track-health"
              className="px-2.5 py-1.5 bg-[#333539] hover:bg-[#3C494E] text-[#E2E2E8] text-[11px] font-mono rounded flex items-center justify-center"
            >
              Health
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
