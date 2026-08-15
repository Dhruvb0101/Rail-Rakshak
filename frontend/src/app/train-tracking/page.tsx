'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  Train,
  AlertTriangle,
  Radio,
  Clock,
  Gauge,
  Compass,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  PhoneCall,
  UserCheck,
  CheckCircle2,
  X,
  RefreshCw,
  ExternalLink,
  Layers,
  MapPin,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { LIVE_TRAINS, AI_DETECTIONS } from '@/lib/mockData';
import { LiveTrain, TrainApproachingAlert } from '@/lib/types';

// Dynamically import Leaflet Map (SSR Disabled)
const InteractiveTrainMap = dynamic(
  () => import('@/components/map/InteractiveTrainMap').then((mod) => mod.InteractiveTrainMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full surface-level-1 flex items-center justify-center text-xs font-mono text-[#859399]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00D1FF] animate-ping" />
          <span>Loading Geospatial Live Radar Map...</span>
        </div>
      </div>
    ),
  }
);

export default function TrainTrackingPage() {
  const [trains, setTrains] = useState<LiveTrain[]>(LIVE_TRAINS);
  const [selectedTrain, setSelectedTrain] = useState<LiveTrain>(LIVE_TRAINS[0]);
  const [criticalAlert, setCriticalAlert] = useState<TrainApproachingAlert | null>(
    LIVE_TRAINS[0].approachingAlert || null
  );
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [activeSpeedRestriction, setActiveSpeedRestriction] = useState<boolean>(false);

  // Periodic train position sync (5s interval)
  useEffect(() => {
    const fetchLiveTrains = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
        const res = await fetch(`${backendUrl}/api/trains/live`, {
          signal: AbortSignal.timeout(1200),
        });
        if (res.ok) {
          const data: LiveTrain[] = await res.json();
          setTrains(data);
          const found = data.find((t) => t.id === selectedTrain.id);
          if (found) setSelectedTrain(found);
          const alertTrain = data.find((t) => t.approachingAlert !== null);
          if (alertTrain?.approachingAlert) setCriticalAlert(alertTrain.approachingAlert);
        }
      } catch {
        // Retain local state
      }
    };

    const interval = setInterval(fetchLiveTrains, 5000);
    return () => clearInterval(interval);
  }, [selectedTrain.id]);

  const handleIssueSpeedRestriction = () => {
    setActiveSpeedRestriction(true);
    setActionSuccessMessage('Caution Order Transmitted via RTIS: 30 km/h Speed Limit Imposed for Train 12001.');
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const handleContactControlRoom = () => {
    setActionSuccessMessage('Control Room Radio Intercom Connected: Baroda House Central Dispatch.');
    setTimeout(() => setActionSuccessMessage(null), 3500);
  };

  const handleAssignEngineer = () => {
    setActionSuccessMessage('Dispatched Emergency P-Way Gang (SE Rajesh Sharma) to KM 142.6.');
    setTimeout(() => setActionSuccessMessage(null), 3500);
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#333A48]">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#E2E2E8] tracking-tight flex items-center gap-2">
            <Train className="w-6 h-6 text-[#00D1FF]" />
            <span>Live Train Tracking & Network Telemetry</span>
          </h1>
          <p className="text-xs lg:text-sm font-mono text-[#859399] mt-0.5">
            Geospatial train symbols, live route paths & real-time defect proximity correlation.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="px-2.5 py-1 rounded bg-[#1A1D24] border border-[#333A48] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4EDEA3] animate-pulse" />
            <span className="text-[#BBC9CF]">TRACKING:</span>
            <span className="text-[#4EDEA3] font-bold">{trains.length} TRAINS ACTIVE</span>
          </div>
          <span className="text-[10px] text-[#859399] px-2 py-1 bg-[#111317] rounded border border-[#333A48]">
            SYNC: 5s
          </span>
        </div>
      </div>

      {/* Critical Train Approaching Defect Alert Banner */}
      {criticalAlert && (
        <div className="p-4 bg-[#93000A]/30 border-2 border-[#EF4444] rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.25)] flex flex-col lg:flex-row lg:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="flex items-start gap-3.5">
            <div className="p-2 bg-[#EF4444] rounded-lg text-white animate-bounce shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#EF4444] text-white">
                  ⚠ CRITICAL SAFETY EVENT
                </span>
                <span className="text-xs font-mono text-[#FFB4AB] font-bold">
                  PROXIMITY COLLISION WARNING
                </span>
              </div>
              <h2 className="text-sm lg:text-base font-bold text-[#E2E2E8] mt-1">
                Train {criticalAlert.trainNumber} ({criticalAlert.trainName}) is approaching {criticalAlert.defectType} at {criticalAlert.locationKm}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#FFDAD6] mt-1">
                <span>Distance: <span className="font-bold text-[#FFB4AB]">{criticalAlert.distanceKm} km</span></span>
                <span>Speed: <span className="font-bold text-[#FFFFFF]">{criticalAlert.speedKmH} km/h</span></span>
                <span>Estimated Arrival: <span className="font-bold text-[#FFB4AB] animate-pulse">{criticalAlert.etaFormatted}</span></span>
                {activeSpeedRestriction && (
                  <span className="px-2 py-0.5 bg-[#4EDEA3]/20 text-[#4EDEA3] rounded border border-[#4EDEA3]/40 font-bold">
                    ✓ 30 KM/H SPEED RESTRICTION ACTIVE
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Safeguard Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleIssueSpeedRestriction}
              className="px-3 py-1.5 bg-[#EF4444] hover:bg-[#FFB4AB] text-white hover:text-[#001F28] rounded font-mono text-xs font-bold transition-all shadow-[0_0_10px_rgba(239,68,68,0.5)] flex items-center gap-1.5"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>ISSUE CAUTION ORDER (30 km/h)</span>
            </button>
            <button
              onClick={handleContactControlRoom}
              className="px-3 py-1.5 bg-[#1E2024] hover:bg-[#262B36] text-[#A4E6FF] border border-[#00D1FF]/40 rounded font-mono text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#00D1FF]" />
              <span>Contact Loco Pilot</span>
            </button>
            <button
              onClick={handleAssignEngineer}
              className="px-3 py-1.5 bg-[#1E2024] hover:bg-[#262B36] text-[#4EDEA3] border border-[#4EDEA3]/40 rounded font-mono text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Dispatch Gang</span>
            </button>
          </div>
        </div>
      )}

      {/* Toast Feedback */}
      {actionSuccessMessage && (
        <div className="p-3 bg-[#00A572]/20 border border-[#4EDEA3] rounded text-xs font-mono text-[#4EDEA3] flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Main Dual-Pane: Interactive GIS Map with Train Symbols & Live Path + Detail Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 h-[calc(100vh-210px)] min-h-[600px]">
        {/* Left Interactive Full Map Viewport (8 cols on xl) */}
        <section className="xl:col-span-8 surface-level-1 rounded-xl border border-[#333A48] overflow-hidden flex flex-col relative">
          <InteractiveTrainMap
            trains={trains}
            selectedTrain={selectedTrain}
            onSelectTrain={(t) => setSelectedTrain(t)}
            showWeatherLayer={true}
          />
        </section>

        {/* Right Train Detail Panel (4 cols on xl) */}
        <aside className="xl:col-span-4 surface-level-1 rounded-xl border border-[#333A48] flex flex-col overflow-hidden h-full">
          {/* Panel Header */}
          <div className="p-4 border-b border-[#333A48] bg-[#1E2024]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-[#00D1FF]/10 text-[#00D1FF] border border-[#00D1FF]/30">
                TRAIN {selectedTrain.trainNumber}
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border ${
                  selectedTrain.status === 'WARNING'
                    ? 'bg-[#93000A] text-[#FFB4AB] border-[#FFB4AB]/40'
                    : selectedTrain.status === 'DELAYED'
                    ? 'bg-[#FFB044]/20 text-[#FFB044] border-[#FFB044]/30'
                    : 'bg-[#00A572]/20 text-[#4EDEA3] border-[#4EDEA3]/30'
                }`}
              >
                {selectedTrain.status}
              </span>
            </div>
            <h2 className="text-base font-bold text-[#E2E2E8]">{selectedTrain.trainName}</h2>
            <p className="text-[11px] font-mono text-[#859399] mt-0.5">{selectedTrain.route}</p>
          </div>

          {/* Scrollable Telemetry Specifications */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-mono">
            {/* Speed & Delay Grid */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-[#111317] rounded-lg border border-[#333A48]">
              <div>
                <span className="text-[10px] text-[#859399] block mb-0.5">CURRENT SPEED</span>
                <span className="text-xl font-bold font-sans text-[#E2E2E8]">
                  {selectedTrain.speedKmH} <span className="text-xs font-mono font-normal text-[#859399]">km/h</span>
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#859399] block mb-0.5">SCHEDULE DELAY</span>
                <span
                  className={`text-xl font-bold font-sans ${
                    selectedTrain.delayMinutes > 0 ? 'text-[#FFB044]' : 'text-[#4EDEA3]'
                  }`}
                >
                  {selectedTrain.delayMinutes > 0 ? `+${selectedTrain.delayMinutes} min` : 'ON TIME'}
                </span>
              </div>
            </div>

            {/* Coordinates & Heading */}
            <div className="p-3 bg-[#111317] rounded-lg border border-[#333A48] space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-[#859399]">GPS Position:</span>
                <span className="text-[#00D1FF] font-bold">
                  {selectedTrain.latitude}° N, {selectedTrain.longitude}° E
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#859399]">Heading:</span>
                <span className="text-[#E2E2E8] font-bold">{selectedTrain.direction}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#859399]">Telemetry Feed:</span>
                <span className="text-[#4EDEA3]">{selectedTrain.dataSource}</span>
              </div>
            </div>

            {/* Current & Next Station */}
            <div className="p-3 bg-[#111317] rounded-lg border border-[#333A48] space-y-2">
              <div className="flex items-center justify-between border-b border-[#333A48] pb-2">
                <div>
                  <span className="text-[10px] text-[#859399] block">CURRENT STATION</span>
                  <span className="text-xs font-bold text-[#E2E2E8]">{selectedTrain.currentStation}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#00D1FF]" />
                <div className="text-right">
                  <span className="text-[10px] text-[#859399] block">NEXT STOP (ETA)</span>
                  <span className="text-xs font-bold text-[#4EDEA3]">
                    {selectedTrain.nextStation} ({selectedTrain.eta})
                  </span>
                </div>
              </div>

              {/* Upcoming Station Stops */}
              <div>
                <span className="text-[10px] text-[#859399] uppercase font-bold block mb-1.5">
                  Upcoming Station Timetable
                </span>
                <div className="space-y-1">
                  {selectedTrain.nextStations.map((st, i) => (
                    <div key={i} className="flex justify-between text-[11px] text-[#BBC9CF]">
                      <span>{st.name}</span>
                      <span className="text-[#00D1FF] font-bold">{st.eta}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Train Proximity Alert if active */}
            {selectedTrain.approachingAlert && (
              <div className="p-3 bg-[#93000A]/20 border-l-4 border-l-[#EF4444] rounded border border-[#EF4444]/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#FFB4AB] uppercase">
                    Approaching Track Defect
                  </span>
                  <span className="text-[10px] font-bold text-[#FFB4AB]">
                    {selectedTrain.approachingAlert.distanceKm} km away
                  </span>
                </div>
                <p className="text-[11px] text-[#E2E2E8] font-bold">
                  {selectedTrain.approachingAlert.defectType} ({selectedTrain.approachingAlert.locationKm})
                </p>
                <p className="text-[10px] text-[#BBC9CF]">
                  ETA: <span className="text-[#FFB4AB] font-bold">{selectedTrain.approachingAlert.etaFormatted}</span>
                </p>
              </div>
            )}
          </div>

          {/* Quick Actions Footer */}
          <div className="p-3 bg-[#111317] border-t border-[#333A48] space-y-2">
            <Link
              href="/ai-detection?defectId=DET-2026-0892"
              className="w-full py-2 bg-[#00D1FF] hover:bg-[#4CD6FF] text-[#001F28] rounded font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-[0_0_12px_rgba(0,209,255,0.25)]"
            >
              <span>INSPECT CORRESPONDING DEFECT</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
