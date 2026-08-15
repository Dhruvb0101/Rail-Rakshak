'use client';

import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Shield,
  BrainCircuit,
  Bell,
  Save,
  CheckCircle2,
  Sliders,
  User,
  Radio,
} from 'lucide-react';

export default function SettingsPage() {
  const [confidenceThreshold, setConfidenceThreshold] = useState(75);
  const [criticalThreshold, setCriticalThreshold] = useState(90);
  const [autoCautionOrder, setAutoCautionOrder] = useState(true);
  const [telegramAlerts, setTelegramAlerts] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage('Platform settings successfully saved & synchronized.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#333A48]">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#E2E2E8] tracking-tight flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-[#00D1FF]" />
            <span>Platform Configuration & AI Parameters</span>
          </h1>
          <p className="text-xs lg:text-sm font-mono text-[#859399] mt-1">
            Configure safety decision boundaries, AI model sensitivity & division roles.
          </p>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3 bg-[#00A572]/20 border border-[#4EDEA3] rounded text-xs font-mono text-[#4EDEA3] flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: AI Model & Decision Boundaries */}
        <div className="surface-level-1 rounded-xl border border-[#333A48] p-5 space-y-4">
          <h3 className="font-mono text-xs font-bold text-[#A4E6FF] uppercase tracking-wider flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-[#00D1FF]" />
            Computer Vision & Defect Thresholds
          </h3>

          <div className="space-y-4 text-xs font-mono">
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-[#BBC9CF]">Mandatory Human Verification Threshold</span>
                <span className="text-[#00D1FF] font-bold">&lt; {confidenceThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="90"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                className="w-full accent-[#00D1FF]"
              />
              <p className="text-[10px] text-[#859399] mt-1">
                Detections scoring below this value will require mandatory sign-off from a Senior Section Engineer before imposing speed orders.
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-[#BBC9CF]">Automatic Critical Alert Trigger</span>
                <span className="text-[#EF4444] font-bold">&gt;= {criticalThreshold}%</span>
              </div>
              <input
                type="range"
                min="80"
                max="99"
                value={criticalThreshold}
                onChange={(e) => setCriticalThreshold(Number(e.target.value))}
                className="w-full accent-[#EF4444]"
              />
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[#333A48]">
              <div>
                <span className="text-[#E2E2E8] font-bold block">Autonomous Caution Speed Order Dispatch</span>
                <span className="text-[10px] text-[#859399]">
                  Instantly transmit 30 km/h speed restriction to Loco Pilots via Kavach / RTIS on critical fracture detection.
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoCautionOrder}
                onChange={(e) => setAutoCautionOrder(e.target.checked)}
                className="w-4 h-4 accent-[#00D1FF]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Division & Notification Routing */}
        <div className="surface-level-1 rounded-xl border border-[#333A48] p-5 space-y-4">
          <h3 className="font-mono text-xs font-bold text-[#A4E6FF] uppercase tracking-wider flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#00D1FF]" />
            Control Room Alert Broadcast Channels
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3 bg-[#111317] rounded border border-[#333A48] space-y-1">
              <span className="text-[#859399] block text-[10px]">RAILWAY DIVISION</span>
              <span className="text-sm font-bold text-[#E2E2E8]">Delhi Division (Northern Railway)</span>
            </div>

            <div className="p-3 bg-[#111317] rounded border border-[#333A48] space-y-1">
              <span className="text-[#859399] block text-[10px]">DISPATCH HEADQUARTERS</span>
              <span className="text-sm font-bold text-[#E2E2E8]">Baroda House, New Delhi</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-[#333A48] text-xs font-mono">
            <div>
              <span className="text-[#E2E2E8] font-bold block">Critical Alert Push Notifications</span>
              <span className="text-[10px] text-[#859399]">
                Send instant alerts to DRM, ADRM & Senior Divisional Engineers on Mobile / SMS.
              </span>
            </div>
            <input
              type="checkbox"
              checked={telegramAlerts}
              onChange={(e) => setTelegramAlerts(e.target.checked)}
              className="w-4 h-4 accent-[#00D1FF]"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#00D1FF] hover:bg-[#4CD6FF] text-[#001F28] font-mono text-xs font-bold rounded-lg flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(0,209,255,0.25)] active:scale-95"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>SAVE CONFIGURATION</span>
          </button>
        </div>
      </form>
    </div>
  );
}
