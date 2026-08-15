'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Train,
  CloudRain,
  Activity,
  AlertTriangle,
  Radio,
  ArrowRight,
  ShieldAlert,
  Thermometer,
  Eye,
  Droplets,
  ExternalLink,
  Route,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';
import { LiveMapWidget } from '@/components/dashboard/LiveMapWidget';
import { LatestDetections } from '@/components/dashboard/LatestDetections';
import {
  INITIAL_KPIS,
  TRACK_SECTIONS,
  AI_DETECTIONS,
  LIVE_TRAINS,
  MOCK_WEATHER,
} from '@/lib/mockData';

export default function DashboardPage() {
  const [kpis] = useState(INITIAL_KPIS);
  const [trainApproaching] = useState(LIVE_TRAINS[0].approachingAlert || null);

  return (
    <div className="space-y-6">
      {/* Top Banner: Critical Train Approaching Defect Event */}
      {trainApproaching && (
        <div className="p-4 bg-[#93000A]/30 border-2 border-[#EF4444] rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#EF4444] text-white rounded-lg">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="bg-[#EF4444] text-white px-2 py-0.5 rounded font-bold">
                  CRITICAL TRAIN SAFETY ALERT
                </span>
                <span className="text-[#FFB4AB]">Distance: {trainApproaching.distanceKm} km • ETA: {trainApproaching.etaFormatted}</span>
              </div>
              <p className="text-sm font-bold text-[#E2E2E8] mt-0.5">
                Train {trainApproaching.trainNumber} ({trainApproaching.trainName}) is approaching {trainApproaching.defectType} at {trainApproaching.locationKm}
              </p>
            </div>
          </div>

          <Link
            href="/train-tracking"
            className="px-3.5 py-1.5 bg-[#EF4444] hover:bg-[#FFB4AB] text-white hover:text-[#001F28] rounded font-mono text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shadow-md"
          >
            <span>LIVE INTERCEPT</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Top Industrial KPI Cards (6 Cards Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Track Network"
          value={kpis.trackNetworkKm.toLocaleString()}
          unit="km"
          icon={Route}
          badgeText={`+${kpis.trackNetworkChangeKm} km`}
          badgeVariant="success"
        />

        <KPICard
          title="Live Trains"
          value={kpis.liveTrainsCount}
          icon={Train}
          badgeText={`${kpis.runningTrainsCount} RUNNING`}
          badgeVariant="success"
        />

        <KPICard
          title="Track Health"
          value={`${kpis.trackHealthPct}%`}
          icon={ShieldCheck}
          badgeText={kpis.trackHealthStatus}
          badgeVariant="neutral"
        />

        <KPICard
          title="Weather Risk"
          value={`${kpis.weatherRiskScore}/100`}
          icon={CloudRain}
          badgeText="HIGH RISK"
          badgeVariant="error"
        />

        <KPICard
          title="Active Alerts"
          value={kpis.activeAlertsCount}
          icon={AlertTriangle}
          badgeText={`${kpis.criticalAlertsCount} CRITICAL`}
          badgeVariant="error"
          valueColor="text-[#EF4444]"
        />

        <KPICard
          title="AI Detections (24h)"
          value={kpis.aiDetectionsToday.toLocaleString()}
          icon={Cpu}
          progressBarPct={kpis.aiDetectionsCapPct}
        />
      </div>

      {/* Weather + Telemetry Quick Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weather Intelligence Compact Widget */}
        <div className="surface-level-1 rounded-xl border border-[#333A48] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#333A48] pb-2 mb-3">
            <span className="text-xs font-mono font-bold text-[#A4E6FF] uppercase flex items-center gap-1.5">
              <CloudRain className="w-4 h-4 text-[#00D1FF]" />
              Weather Intelligence
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#93000A] text-[#FFB4AB] font-bold">
              RISK: HIGH (68%)
            </span>
          </div>

          <div className="flex items-center justify-between text-xs font-mono">
            <div>
              <div className="text-2xl font-bold font-sans text-[#E2E2E8]">
                {MOCK_WEATHER.temperatureC}°C
              </div>
              <span className="text-[#859399]">{MOCK_WEATHER.condition}</span>
            </div>

            <div className="text-right space-y-1 text-[11px] text-[#BBC9CF]">
              <div>Rain: <span className="text-[#00D1FF] font-bold">{MOCK_WEATHER.rainfallMm1h} mm/h</span></div>
              <div>Vis: <span className="text-[#FFB044] font-bold">{MOCK_WEATHER.visibilityKm} km</span></div>
              <div>Wind: <span className="text-[#4EDEA3] font-bold">{MOCK_WEATHER.windSpeedKmh} km/h</span></div>
            </div>
          </div>

          <Link
            href="/weather"
            className="mt-3 pt-2 border-t border-[#333A48] text-[11px] font-mono text-[#00D1FF] hover:text-[#4CD6FF] flex items-center justify-between"
          >
            <span>View Full Weather Vulnerability Matrix</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Live Train Summary Widget */}
        <div className="surface-level-1 rounded-xl border border-[#333A48] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#333A48] pb-2 mb-3">
            <span className="text-xs font-mono font-bold text-[#A4E6FF] uppercase flex items-center gap-1.5">
              <Train className="w-4 h-4 text-[#00D1FF]" />
              Live Train Movement
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00A572]/20 text-[#4EDEA3] font-bold">
              RTIS ACTIVE
            </span>
          </div>

          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-[#859399]">Train 12001 (Shatabdi):</span>
              <span className="text-[#FFB4AB] font-bold">84 km/h • 3.2km to defect</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#859399]">Train 12424 (Rajdhani):</span>
              <span className="text-[#4EDEA3] font-bold">110 km/h • Normal</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#859399]">Train 22436 (Vande Bharat):</span>
              <span className="text-[#4EDEA3] font-bold">130 km/h • On Schedule</span>
            </div>
          </div>

          <Link
            href="/train-tracking"
            className="mt-3 pt-2 border-t border-[#333A48] text-[11px] font-mono text-[#00D1FF] hover:text-[#4CD6FF] flex items-center justify-between"
          >
            <span>Launch Live Train Tracking Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Predictive Maintenance Snapshot */}
        <div className="surface-level-1 rounded-xl border border-[#333A48] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#333A48] pb-2 mb-3">
            <span className="text-xs font-mono font-bold text-[#A4E6FF] uppercase flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#FFB044]" />
              Predictive Maintenance
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#93000A] text-[#FFB4AB] font-bold">
              81% PROBABILITY
            </span>
          </div>

          <div className="space-y-1 text-xs font-mono">
            <div className="text-sm font-bold text-[#E2E2E8]">Rail Joint Degradation (KM 142.6)</div>
            <div className="text-[11px] text-[#BBC9CF]">Intervention window: <span className="text-[#FFB4AB] font-bold">8–14 Days</span></div>
            <div className="text-[10px] text-[#859399]">Base: 72% + Weather impact: +9% (Monsoon Saturation)</div>
          </div>

          <Link
            href="/predictive-maintenance"
            className="mt-3 pt-2 border-t border-[#333A48] text-[11px] font-mono text-[#00D1FF] hover:text-[#4CD6FF] flex items-center justify-between"
          >
            <span>View Degradation Model & Work Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Dual View: Live Telemetry Map Widget + Latest AI Detections */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <section className="xl:col-span-8 flex flex-col min-h-[500px]">
          <LiveMapWidget />
        </section>

        <aside className="xl:col-span-4 flex flex-col min-h-[500px]">
          <LatestDetections />
        </aside>
      </div>
    </div>
  );
}
