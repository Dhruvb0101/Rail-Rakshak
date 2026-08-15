'use client';

import React, { useState } from 'react';
import {
  Activity,
  ShieldCheck,
  AlertTriangle,
  Layers,
  Wrench,
  ChevronRight,
  TrendingUp,
  Download,
} from 'lucide-react';
import { TRACK_SECTIONS } from '@/lib/mockData';

const HEALTH_COMPONENTS = [
  { name: 'Rail Head Wear & Profile', score: 92.4, status: 'optimal', defects: 2, icon: 'route' },
  { name: 'Track Geometry (Gauge & Crosslevel)', score: 96.8, status: 'optimal', defects: 1, icon: 'straighten' },
  { name: 'Concrete Sleepers (PSC)', score: 94.1, status: 'optimal', defects: 3, icon: 'view_agenda' },
  { name: 'Fasteners & Elastic Rail Clips', score: 88.5, status: 'warning', defects: 5, icon: 'link' },
  { name: 'Ballast Cushion & Subgrade', score: 91.0, status: 'optimal', defects: 2, icon: 'grain' },
  { name: 'Fishplates & Welded Joints', score: 78.2, status: 'critical', defects: 4, icon: 'join_inner' },
  { name: 'Catenary & Track Clearance', score: 95.0, status: 'optimal', defects: 1, icon: 'nature_people' },
];

export default function TrackHealthPage() {
  const [selectedSection, setSelectedSection] = useState(TRACK_SECTIONS[0]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#333A48]">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#E2E2E8] tracking-tight">
            Track Health Index & Component Breakdown
          </h1>
          <p className="text-xs lg:text-sm font-mono text-[#859399] mt-1">
            Structural health integrity monitoring across 4,280 km of Northern Railway network.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-[#1A1D24] hover:bg-[#262B36] text-[#BBC9CF] border border-[#333A48] rounded font-mono text-xs flex items-center gap-1.5 transition-colors">
            <Download className="w-3.5 h-3.5" />
            <span>Download Audit (PDF)</span>
          </button>
        </div>
      </div>

      {/* Main Overall Health Banner + Components Breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Overall Health Score Card (Spans 4 cols on xl) */}
        <div className="xl:col-span-4 surface-level-1 rounded-xl border border-[#333A48] p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#4EDEA3]/5 blur-[70px] rounded-full pointer-events-none" />

          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#859399] uppercase tracking-wider">
                OVERALL NETWORK HEALTH
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00A572]/20 text-[#4EDEA3] border border-[#4EDEA3]/40">
                STABLE
              </span>
            </div>

            <div className="my-6 text-center">
              <div className="inline-flex items-baseline justify-center">
                <span className="text-6xl font-bold font-sans text-[#E2E2E8] tracking-tight">94.8</span>
                <span className="text-2xl text-[#859399] font-mono ml-1">/ 100</span>
              </div>
              <p className="text-xs font-mono text-[#BBC9CF] mt-2">
                Composite Track Quality Index (TQI)
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-[#333A48] text-xs font-mono text-[#BBC9CF]">
            <div className="flex justify-between">
              <span className="text-[#859399]">Optimal Route Length:</span>
              <span className="text-[#4EDEA3] font-bold">3,980 km (93.0%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#859399]">Warning Tolerance:</span>
              <span className="text-[#FFB044] font-bold">258 km (6.0%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#859399]">Critical Speed Restriction:</span>
              <span className="text-[#FFB4AB] font-bold">42 km (1.0%)</span>
            </div>
          </div>
        </div>

        {/* 7 Component Breakdown Bars (Spans 8 cols on xl) */}
        <div className="xl:col-span-8 surface-level-1 rounded-xl border border-[#333A48] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs font-bold text-[#BBC9CF] uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#00D1FF]" />
              Sub-System Health Scores
            </h3>
            <span className="text-[11px] font-mono text-[#859399]">Benchmark Standard: IRS-T-12</span>
          </div>

          <div className="space-y-3">
            {HEALTH_COMPONENTS.map((comp) => {
              const isCrit = comp.status === 'critical';
              const isWarn = comp.status === 'warning';
              const barColor = isCrit ? 'bg-[#EF4444]' : isWarn ? 'bg-[#FFB044]' : 'bg-[#4EDEA3]';
              const textColor = isCrit ? 'text-[#FFB4AB]' : isWarn ? 'text-[#FFB044]' : 'text-[#4EDEA3]';

              return (
                <div key={comp.name} className="p-3 bg-[#111317] rounded-lg border border-[#333A48]">
                  <div className="flex justify-between items-center mb-1.5 text-xs font-mono">
                    <span className="text-[#E2E2E8] font-bold">{comp.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-[#859399]">{comp.defects} active anomalies</span>
                      <span className={`font-bold ${textColor}`}>{comp.score}%</span>
                    </div>
                  </div>

                  <div className="w-full bg-[#1E2024] h-2 rounded-full overflow-hidden border border-[#333A48]/50">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${comp.score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Railway Section Heatmap Matrix */}
      <div className="surface-level-1 rounded-xl border border-[#333A48] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-mono text-xs font-bold text-[#BBC9CF] uppercase tracking-wider">
              Delhi Division — Track Section Health Matrix
            </h3>
            <p className="text-xs font-mono text-[#859399] mt-0.5">
              Click a section to inspect localized wear, track geometry & active speed orders.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TRACK_SECTIONS.map((section) => (
            <div
              key={section.id}
              onClick={() => setSelectedSection(section)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedSection.id === section.id
                  ? 'border-[#00D1FF] bg-[#1E2024] shadow-[0_0_15px_rgba(0,209,255,0.15)]'
                  : 'border-[#333A48] bg-[#111317] hover:border-[#859399]'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                      section.status === 'critical'
                        ? 'bg-[#93000A] text-[#FFB4AB] border border-[#FFB4AB]/40'
                        : section.status === 'warning'
                        ? 'bg-[#FFB044]/20 text-[#FFB044] border border-[#FFB044]/30'
                        : 'bg-[#00A572]/20 text-[#4EDEA3]'
                    }`}
                  >
                    {section.status}
                  </span>
                  <h4 className="text-sm font-bold text-[#E2E2E8] mt-1.5">{section.name}</h4>
                  <p className="text-[11px] font-mono text-[#859399]">
                    Code: {section.code} • KM {section.startKm} - {section.endKm}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-bold font-sans text-[#E2E2E8]">
                    {section.healthScore}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#333A48] text-[10px] font-mono text-[#859399]">
                <div>Speed Limit: <span className="text-[#E2E2E8]">{section.lineSpeedLimitKmH} km/h</span></div>
                <div>Sleepers: <span className="text-[#E2E2E8]">{section.sleepersCount.toLocaleString()}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
