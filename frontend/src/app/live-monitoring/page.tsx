'use client';

import React, { useState, useEffect } from 'react';
import {
  Video,
  Camera,
  Play,
  Pause,
  Maximize2,
  Gauge,
  Thermometer,
  Activity,
  AlertTriangle,
  Radio,
  Layers,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { TRACK_SECTIONS } from '@/lib/mockData';

const CAMERAS = [
  {
    id: 'CAM-04',
    name: 'Cam-04 • High-Res Infrared (Diagnostic)',
    type: 'Thermal IR + Optical',
    loco: 'WAP7-3028 (Up Main)',
    speed: 85,
    temp: 34.2,
    vibration: 1.84,
    hasDefect: true,
    defectLabel: 'TF-CRACK DETECTED (KM 142.6)',
  },
  {
    id: 'CAM-01',
    name: 'Cam-01 • Forward Wide-Angle Track Cam',
    type: '4K Ultra-HD Optical',
    loco: 'WAP7-3028 (Forward)',
    speed: 85,
    temp: 32.0,
    vibration: 1.20,
    hasDefect: false,
  },
  {
    id: 'CAM-02',
    name: 'Cam-02 • Underframe Bogie Scanner',
    type: 'High-Speed 240fps Optical',
    loco: 'Coach #2041 Underbody',
    speed: 85,
    temp: 36.5,
    vibration: 2.45,
    hasDefect: true,
    defectLabel: 'FASTENER DISPLACEMENT (KM 88.2)',
  },
  {
    id: 'CAM-03',
    name: 'Cam-03 • Catenary & Pantograph Scanner',
    type: 'Roof Mounted IR Laser',
    loco: 'Loco Roof Unit',
    speed: 85,
    temp: 42.1,
    vibration: 0.95,
    hasDefect: false,
  },
];

export default function LiveMonitoringPage() {
  const [selectedCam, setSelectedCam] = useState(CAMERAS[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showAiOverlay, setShowAiOverlay] = useState(true);
  const [liveTelemetryKm, setLiveTelemetryKm] = useState(142.6);

  // Live simulation ticker for locomotive KM location
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setLiveTelemetryKm((prev) => Number((prev + 0.02).toFixed(2)));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#333A48]">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#E2E2E8] tracking-tight flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#EF4444] animate-ping" />
            <span>Live Track Video Telemetry</span>
          </h1>
          <p className="text-xs font-mono text-[#859399] mt-1">
            Real-time multi-camera CCTV, thermal infrared & on-board computer vision diagnostics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAiOverlay(!showAiOverlay)}
            className={`px-3 py-1.5 rounded font-mono text-xs font-bold border transition-colors flex items-center gap-1.5 ${
              showAiOverlay
                ? 'bg-[#00D1FF]/20 text-[#00D1FF] border-[#00D1FF]/40'
                : 'bg-[#1A1D24] text-[#859399] border-[#333A48]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>AI Bounding Boxes: {showAiOverlay ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Main Video Viewport + Camera Switcher Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Main Feed (Spans 8 cols) */}
        <div className="xl:col-span-8 surface-level-1 rounded-xl border border-[#333A48] overflow-hidden flex flex-col relative h-[500px] lg:h-[580px]">
          {/* Feed Header */}
          <div className="h-10 bg-[#1E2024] border-b border-[#333A48] px-4 flex items-center justify-between text-xs font-mono text-[#BBC9CF] z-20">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4EDEA3] animate-pulse" />
              <span className="text-[#E2E2E8] font-bold">{selectedCam.name}</span>
            </div>
            <span className="text-[#859399]">Vehicle: {selectedCam.loco}</span>
          </div>

          {/* Live Video Canvas */}
          <div className="flex-1 bg-[#0A0A0A] relative overflow-hidden flex items-center justify-center">
            {/* Background Simulated Track Feed */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuA0poUvT85sYQ6T2ZcZWDt8OKia-66TP7GqCQeJnPRQxTZC4q4uZFfJGcH56tTORq1hqSjFUomLdHT4sj1i6W1_IODl_YLpfPpGslpAvfSU-hc3vJSvEklhz9P80MwMTY20NzhBvVEMuDuT3r5zR5HMYctZmkKBO2yfko-EnlEbbxuBzRxIJz0_lACABZnNmqLG1GF5t73Z3B_mSH1Zc8z0kWHUk7LSqUhPl5tkQ1xbb5vr7AJN7v6n')`,
                filter: selectedCam.id === 'CAM-04' ? 'contrast(1.3) hue-rotate(180deg)' : 'none',
              }}
            />

            {/* Radar Scanline Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,209,255,0.05)_1px,transparent_1px)] [background-size:100%_4px] pointer-events-none" />

            {/* Real-time Bounding Box */}
            {showAiOverlay && selectedCam.hasDefect && (
              <div className="absolute top-[40%] left-[42%] w-[160px] h-[100px] border-2 border-[#EF4444] bg-[#EF4444]/15 animate-pulse z-10">
                <div className="absolute -top-6 -left-0.5 bg-[#EF4444] text-[#FFFFFF] text-[10px] font-mono px-2 py-0.5 font-bold flex items-center gap-1 shadow">
                  <AlertTriangle className="w-3 h-3" />
                  <span>{selectedCam.defectLabel}</span>
                </div>
              </div>
            )}

            {/* Floating Live Telemetry HUD */}
            <div className="absolute top-4 left-4 glass-panel p-3 rounded-lg text-xs font-mono text-[#E2E2E8] shadow-2xl z-20 space-y-1.5 min-w-[200px]">
              <div className="flex justify-between border-b border-[#333A48] pb-1">
                <span className="text-[#859399]">TRACK KM:</span>
                <span className="text-[#00D1FF] font-bold">KM {liveTelemetryKm}</span>
              </div>
              <div className="flex justify-between border-b border-[#333A48] pb-1">
                <span className="text-[#859399]">SPEED:</span>
                <span className="text-[#4EDEA3] font-bold">{selectedCam.speed} km/h</span>
              </div>
              <div className="flex justify-between border-b border-[#333A48] pb-1">
                <span className="text-[#859399]">RAIL TEMP:</span>
                <span className="text-[#FFB044] font-bold">{selectedCam.temp}°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#859399]">VIBRATION:</span>
                <span className="text-[#E2E2E8] font-bold">{selectedCam.vibration} g</span>
              </div>
            </div>

            {/* Viewport Play/Pause Control Bar */}
            <div className="absolute bottom-4 right-4 glass-panel px-3 py-1.5 rounded-lg flex items-center gap-3 z-20">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-[#E2E2E8] hover:text-[#00D1FF] transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <div className="h-4 w-px bg-[#333A48]" />
              <span className="text-[11px] font-mono text-[#4EDEA3] flex items-center gap-1">
                <Radio className="w-3 h-3 animate-pulse" /> LIVE STREAM
              </span>
            </div>
          </div>
        </div>

        {/* Camera Selector Sidebar (Spans 4 cols) */}
        <div className="xl:col-span-4 surface-level-1 rounded-xl border border-[#333A48] p-4 flex flex-col justify-between space-y-3">
          <div>
            <h3 className="text-sm font-bold text-[#E2E2E8] font-mono uppercase tracking-wider mb-3 flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#00D1FF]" />
              Surveillance Camera Array (4 Feeds)
            </h3>

            <div className="space-y-3">
              {CAMERAS.map((cam) => {
                const isSelected = selectedCam.id === cam.id;
                return (
                  <div
                    key={cam.id}
                    onClick={() => setSelectedCam(cam)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#00D1FF] bg-[#1E2024] shadow-[0_0_15px_rgba(0,209,255,0.15)]'
                        : 'border-[#333A48] bg-[#111317] hover:border-[#859399]'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xs font-bold text-[#E2E2E8]">{cam.name}</div>
                        <div className="text-[10px] font-mono text-[#859399] mt-0.5">{cam.type}</div>
                      </div>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                          cam.hasDefect
                            ? 'bg-[#93000A] text-[#FFB4AB] border border-[#FFB4AB]/40'
                            : 'bg-[#00A572]/20 text-[#4EDEA3]'
                        }`}
                      >
                        {cam.hasDefect ? 'DEFECT DETECTED' : 'CLEAR'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-[#859399] mt-2 pt-2 border-t border-[#333A48]/60">
                      <span>Temp: {cam.temp}°C</span>
                      <span>Vib: {cam.vibration}g</span>
                      <span className="text-[#00D1FF]">30 FPS</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 bg-[#111317] border border-[#333A48] rounded-lg text-xs font-mono text-[#859399]">
            <p className="text-[#E2E2E8] font-bold mb-1">Optical Stream Diagnostics</p>
            <p>H.265 / RTSP Stream • Low-latency 45ms • Server GPU: NVIDIA RTX 6000 Ada</p>
          </div>
        </div>
      </div>
    </div>
  );
}
