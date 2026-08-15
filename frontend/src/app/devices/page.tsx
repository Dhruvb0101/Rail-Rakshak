'use client';

import React, { useState } from 'react';
import {
  Radio,
  Battery,
  Wifi,
  Cpu,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Activity,
} from 'lucide-react';
import { SENSOR_DEVICES } from '@/lib/mockData';
import { DeviceSensor } from '@/lib/types';

export default function DevicesPage() {
  const [devices, setDevices] = useState<DeviceSensor[]>(SENSOR_DEVICES);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handlePingDevice = (code: string) => {
    setToastMessage(`Ping sent to ${code} • Heartbeat acknowledged (14ms latency)`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#333A48]">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#E2E2E8] tracking-tight flex items-center gap-2">
            <Radio className="w-6 h-6 text-[#00D1FF]" />
            <span>Trackside Sensors & IoT Edge Telemetry</span>
          </h1>
          <p className="text-xs lg:text-sm font-mono text-[#859399] mt-1">
            Real-time status of acoustic stress detectors, fiber DTS loops & wayside inspection cameras.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setToastMessage('Polling all wayside IoT nodes...');
              setTimeout(() => setToastMessage(null), 2500);
            }}
            className="px-3.5 py-2 bg-[#1A1D24] hover:bg-[#262B36] text-[#00D1FF] border border-[#333A48] rounded font-mono text-xs flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>POLL SENSORS</span>
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3 bg-[#00A572]/20 border border-[#4EDEA3] rounded text-xs font-mono text-[#4EDEA3] flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {devices.map((device) => {
          const isOnline = device.status === 'online';
          const isWarning = device.status === 'warning';
          const isOffline = device.status === 'offline';

          return (
            <div
              key={device.id}
              className="surface-level-1 rounded-xl border border-[#333A48] p-5 space-y-4 flex flex-col justify-between hover:border-[#00D1FF]/40 transition-all"
            >
              {/* Header */}
              <div>
                <div className="flex items-start justify-between">
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase border ${
                      isOnline
                        ? 'bg-[#00A572]/20 text-[#4EDEA3] border-[#4EDEA3]/40'
                        : isWarning
                        ? 'bg-[#FFB044]/20 text-[#FFB044] border-[#FFB044]/40'
                        : 'bg-[#93000A] text-[#FFB4AB] border-[#FFB4AB]/40'
                    }`}
                  >
                    {device.status}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#00D1FF]">{device.deviceCode}</span>
                </div>

                <h3 className="text-sm font-bold text-[#E2E2E8] mt-2">{device.name}</h3>
                <p className="text-[11px] font-mono text-[#859399] mt-0.5">{device.location}</p>
              </div>

              {/* Telemetry Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 bg-[#111317] rounded border border-[#333A48]">
                  <span className="text-[10px] text-[#859399] flex items-center gap-1">
                    <Battery className="w-3 h-3 text-[#4EDEA3]" /> BATTERY
                  </span>
                  <span
                    className={`text-sm font-bold mt-1 block ${
                      device.batteryPct < 20 ? 'text-[#FFB4AB]' : 'text-[#E2E2E8]'
                    }`}
                  >
                    {device.batteryPct}%
                  </span>
                </div>

                <div className="p-2.5 bg-[#111317] rounded border border-[#333A48]">
                  <span className="text-[10px] text-[#859399] flex items-center gap-1">
                    <Wifi className="w-3 h-3 text-[#00D1FF]" /> SIGNAL
                  </span>
                  <span className="text-sm font-bold text-[#E2E2E8] mt-1 block">
                    {device.signalStrengthDbm} dBm
                  </span>
                </div>
              </div>

              {/* Live Sensor Values */}
              <div className="p-3 bg-[#111317] rounded-lg border border-[#333A48] text-[11px] font-mono space-y-1">
                {device.telemetry.temperatureC && (
                  <div className="flex justify-between">
                    <span className="text-[#859399]">Temperature:</span>
                    <span className="text-[#E2E2E8] font-bold">{device.telemetry.temperatureC}°C</span>
                  </div>
                )}
                {device.telemetry.vibrationG && (
                  <div className="flex justify-between">
                    <span className="text-[#859399]">Axle Vibration:</span>
                    <span className="text-[#E2E2E8] font-bold">{device.telemetry.vibrationG} g</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#859399]">Last Heartbeat:</span>
                  <span className="text-[#4EDEA3]">{device.lastCommunicationSec}s ago</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handlePingDevice(device.deviceCode)}
                className="w-full py-2 bg-[#1E2024] hover:bg-[#262B36] text-[#BBC9CF] hover:text-[#E2E2E8] border border-[#333A48] rounded font-mono text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-[#00D1FF]" />
                <span>Test Connectivity & Diagnostics</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
