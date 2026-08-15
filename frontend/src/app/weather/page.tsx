'use client';

import React, { useState } from 'react';
import {
  CloudRain,
  Thermometer,
  Wind,
  Eye,
  Gauge,
  Droplets,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Download,
  Info,
  Layers,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { MOCK_WEATHER, MOCK_FORECAST } from '@/lib/mockData';
import { WeatherData } from '@/lib/types';

export default function WeatherIntelligencePage() {
  const [weather, setWeather] = useState<WeatherData>(MOCK_WEATHER);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#333A48]">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#E2E2E8] tracking-tight flex items-center gap-2">
            <CloudRain className="w-6 h-6 text-[#00D1FF]" />
            <span>Weather Intelligence & Track Risk Engine</span>
          </h1>
          <p className="text-xs lg:text-sm font-mono text-[#859399] mt-1">
            Real-time meteorology telemetry, ballast saturation models & catenary wind sway risk for Delhi Division.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="px-3 py-1.5 rounded bg-[#93000A]/30 border border-[#EF4444]/40 text-[#FFB4AB] font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-ping" />
            <span>WEATHER RISK: {weather.weatherRiskLevel} ({weather.weatherRiskScore}/100)</span>
          </div>
        </div>
      </div>

      {/* Main Meteorological Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Temp & Feels Like */}
        <div className="surface-level-1 p-4 rounded-xl border border-[#333A48] space-y-1">
          <div className="flex justify-between items-start text-xs font-mono text-[#859399]">
            <span className="uppercase">Temperature</span>
            <Thermometer className="w-4 h-4 text-[#FFB044]" />
          </div>
          <div className="text-3xl font-bold font-sans text-[#E2E2E8]">
            {weather.temperatureC}°C
          </div>
          <p className="text-[11px] font-mono text-[#BBC9CF]">
            Feels like: <span className="text-[#FFB044] font-bold">{weather.feelsLikeC}°C</span>
          </p>
        </div>

        {/* Metric 2: Precipitation */}
        <div className="surface-level-1 p-4 rounded-xl border border-[#333A48] space-y-1">
          <div className="flex justify-between items-start text-xs font-mono text-[#859399]">
            <span className="uppercase">Rainfall Rate</span>
            <Droplets className="w-4 h-4 text-[#00D1FF]" />
          </div>
          <div className="text-3xl font-bold font-sans text-[#00D1FF]">
            {weather.rainfallMm1h} <span className="text-xs font-mono text-[#859399]">mm/h</span>
          </div>
          <p className="text-[11px] font-mono text-[#FFB4AB]">
            Heavy Downpour (Monsoon Alert)
          </p>
        </div>

        {/* Metric 3: Wind Velocity */}
        <div className="surface-level-1 p-4 rounded-xl border border-[#333A48] space-y-1">
          <div className="flex justify-between items-start text-xs font-mono text-[#859399]">
            <span className="uppercase">Wind Velocity</span>
            <Wind className="w-4 h-4 text-[#4EDEA3]" />
          </div>
          <div className="text-3xl font-bold font-sans text-[#E2E2E8]">
            {weather.windSpeedKmh} <span className="text-xs font-mono text-[#859399]">km/h</span>
          </div>
          <p className="text-[11px] font-mono text-[#BBC9CF]">
            Heading: <span className="text-[#4EDEA3]">{weather.windDirectionDeg}° (ESE)</span>
          </p>
        </div>

        {/* Metric 4: Visibility */}
        <div className="surface-level-1 p-4 rounded-xl border border-[#333A48] space-y-1">
          <div className="flex justify-between items-start text-xs font-mono text-[#859399]">
            <span className="uppercase">Track Visibility</span>
            <Eye className="w-4 h-4 text-[#FFB044]" />
          </div>
          <div className="text-3xl font-bold font-sans text-[#FFB044]">
            {weather.visibilityKm} <span className="text-xs font-mono text-[#859399]">km</span>
          </div>
          <p className="text-[11px] font-mono text-[#859399]">
            Humidity: <span className="text-[#E2E2E8]">{weather.humidityPct}%</span> • {weather.pressureHpa} hPa
          </p>
        </div>
      </div>

      {/* Sub-System Railway Risk Analysis (The Core Feature) */}
      <div className="surface-level-1 rounded-xl border border-[#333A48] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#333A48] pb-3">
          <h3 className="font-mono text-xs font-bold text-[#A4E6FF] uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#EF4444]" />
            Weather Sub-System Railway Vulnerability Assessment
          </h3>
          <span className="text-[10px] font-mono text-[#859399]">Calculated via RailRakshak Risk Engine</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          {/* Drainage Risk */}
          <div className="p-4 bg-[#111317] rounded-lg border border-[#EF4444]/40 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#E2E2E8] uppercase">1. Drainage & Ballast Bed Saturation</span>
              <span className="px-2 py-0.5 rounded bg-[#93000A] text-[#FFB4AB] font-bold text-[10px]">
                HIGH RISK
              </span>
            </div>
            <p className="text-[11px] text-[#BBC9CF] leading-relaxed">{weather.drainageRisk}</p>
            <p className="text-[10px] text-[#859399]">
              Ballast liquefaction threshold exceeded on low-lying yard sidings.
            </p>
          </div>

          {/* Buckling / Expansion Risk */}
          <div className="p-4 bg-[#111317] rounded-lg border border-[#333A48] space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#E2E2E8] uppercase">2. Rail Thermal Buckling / Contraction</span>
              <span className="px-2 py-0.5 rounded bg-[#00A572]/20 text-[#4EDEA3] font-bold text-[10px]">
                OPTIMAL
              </span>
            </div>
            <p className="text-[11px] text-[#BBC9CF] leading-relaxed">{weather.bucklingRisk}</p>
            <p className="text-[10px] text-[#859399]">
              Steel temperature within safe 28°C - 38°C expansion envelope.
            </p>
          </div>

          {/* Catenary Risk */}
          <div className="p-4 bg-[#111317] rounded-lg border border-[#FFB044]/30 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#E2E2E8] uppercase">3. Overhead Catenary Wire Sway</span>
              <span className="px-2 py-0.5 rounded bg-[#FFB044]/20 text-[#FFB044] font-bold text-[10px]">
                MODERATE
              </span>
            </div>
            <p className="text-[11px] text-[#BBC9CF] leading-relaxed">{weather.catenaryRisk}</p>
            <p className="text-[10px] text-[#859399]">
              Crosswinds require vigilance for pantograph-catenary interaction on high bridges.
            </p>
          </div>

          {/* Visibility Risk */}
          <div className="p-4 bg-[#111317] rounded-lg border border-[#FFB044]/30 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#E2E2E8] uppercase">4. Optical Sightlines & FogPASS</span>
              <span className="px-2 py-0.5 rounded bg-[#FFB044]/20 text-[#FFB044] font-bold text-[10px]">
                RESTRICTED
              </span>
            </div>
            <p className="text-[11px] text-[#BBC9CF] leading-relaxed">{weather.visibilityRisk}</p>
            <p className="text-[10px] text-[#859399]">
              Loco pilot sighting distance reduced to 2.1 km. Automatic cab signaling active.
            </p>
          </div>
        </div>

        {/* Dynamic Impact Summary Callout */}
        <div className="p-3 bg-[#111317] border border-[#00D1FF]/30 rounded-lg text-xs font-mono text-[#BBC9CF] flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#00D1FF] shrink-0 mt-0.5" />
          <div>
            <span className="text-[#00D1FF] font-bold">Track Safety Directive: </span>
            <span>{weather.trackImpactSummary}</span>
          </div>
        </div>
      </div>

      {/* Hourly Weather Risk Progression Chart */}
      <div className="surface-level-1 rounded-xl border border-[#333A48] p-5 space-y-4">
        <h3 className="font-mono text-xs font-bold text-[#BBC9CF] uppercase tracking-wider flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#00D1FF]" />
          12-Hour Weather Risk Progression Trajectory
        </h3>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_FORECAST} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="weatherRiskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D1FF" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#00D1FF" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#859399" fontSize={11} fontFamily="JetBrains Mono" />
              <YAxis stroke="#859399" fontSize={11} fontFamily="JetBrains Mono" domain={[0, 100]} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A1D24',
                  borderColor: '#333A48',
                  borderRadius: '6px',
                  fontFamily: 'JetBrains Mono',
                  fontSize: '12px',
                }}
              />
              <ReferenceLine y={50} stroke="#FFB044" strokeDasharray="3 3" label={{ value: 'Elevated Risk (50%)', fill: '#FFB044', fontSize: 10 }} />
              <Area type="monotone" dataKey="riskScore" name="Weather Risk Score" stroke="#00D1FF" strokeWidth={3} fill="url(#weatherRiskGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
