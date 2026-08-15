'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { X, ClipboardPlus, CheckCircle2 } from 'lucide-react';
import { TRACK_SECTIONS } from '@/lib/mockData';

export function Shell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newInspectionModalOpen, setNewInspectionModalOpen] = useState(false);
  const [sectionCode, setSectionCode] = useState(TRACK_SECTIONS[0].code);
  const [inspectorName, setInspectorName] = useState('Er. Vikramaditya Singh');
  const [vehicleType, setVehicleType] = useState('Track Recording Car (TRC-2000)');
  const [inspectionSuccess, setInspectionSuccess] = useState(false);

  const handleCreateInspection = (e: React.FormEvent) => {
    e.preventDefault();
    setInspectionSuccess(true);
    setTimeout(() => {
      setInspectionSuccess(false);
      setNewInspectionModalOpen(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0F1115] flex">
      {/* 320px Sidebar */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onNewInspectionClick={() => setNewInspectionModalOpen(true)}
      />

      {/* Main Content Area (Offset by 320px on desktop) */}
      <div className="flex-1 lg:ml-[320px] flex flex-col min-h-screen w-full lg:w-[calc(100%-320px)] overflow-x-hidden">
        <Header onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>

      {/* New Inspection Modal */}
      {newInspectionModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1D24] border border-[#333A48] rounded-xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-[#111317] border-b border-[#333A48] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-[#00D1FF]/10 border border-[#00D1FF]/40 flex items-center justify-center text-[#00D1FF]">
                  <ClipboardPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#E2E2E8]">Schedule Track Inspection</h3>
                  <p className="text-[11px] font-mono text-[#859399]">Delhi Division • Automated Dispatch</p>
                </div>
              </div>
              <button
                onClick={() => setNewInspectionModalOpen(false)}
                className="p-1 rounded text-[#859399] hover:text-[#E2E2E8] hover:bg-[#333539]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {inspectionSuccess ? (
              <div className="p-8 text-center flex flex-col items-center justify-center gap-3">
                <CheckCircle2 className="w-12 h-12 text-[#4EDEA3] animate-bounce" />
                <h4 className="text-base font-bold text-[#E2E2E8]">Inspection Work Order Created!</h4>
                <p className="text-xs font-mono text-[#BBC9CF]">
                  Assigned ID: #INS-RD-{Math.floor(1000 + Math.random() * 9000)} • Dispatching TRC-2000
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateInspection} className="p-5 space-y-4 text-xs font-mono">
                <div>
                  <label className="block text-[#BBC9CF] mb-1">Track Section Corridor</label>
                  <select
                    value={sectionCode}
                    onChange={(e) => setSectionCode(e.target.value)}
                    className="w-full bg-[#111317] border border-[#333A48] focus:border-[#00D1FF] rounded px-3 py-2 text-[#E2E2E8] focus:outline-none"
                  >
                    {TRACK_SECTIONS.map((sec) => (
                      <option key={sec.code} value={sec.code}>
                        {sec.code} — {sec.name} (KM {sec.startKm} - {sec.endKm})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#BBC9CF] mb-1">Lead Inspector</label>
                    <input
                      type="text"
                      value={inspectorName}
                      onChange={(e) => setInspectorName(e.target.value)}
                      className="w-full bg-[#111317] border border-[#333A48] focus:border-[#00D1FF] rounded px-3 py-2 text-[#E2E2E8] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#BBC9CF] mb-1">Inspection Date</label>
                    <input
                      type="date"
                      defaultValue="2026-08-16"
                      className="w-full bg-[#111317] border border-[#333A48] focus:border-[#00D1FF] rounded px-3 py-2 text-[#E2E2E8] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#BBC9CF] mb-1">Vehicle / Equipment Type</label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full bg-[#111317] border border-[#333A48] focus:border-[#00D1FF] rounded px-3 py-2 text-[#E2E2E8] focus:outline-none"
                  >
                    <option value="Track Recording Car (TRC-2000)">Track Recording Car (TRC-2000)</option>
                    <option value="Autonomous AI Drone + LiDAR">Autonomous AI Drone + LiDAR</option>
                    <option value="Motorized Inspection Trolley (MIT-08)">Motorized Inspection Trolley (MIT-08)</option>
                    <option value="Manual Ultrasonic Gang (USFD)">Manual Ultrasonic Gang (USFD)</option>
                  </select>
                </div>

                <div className="p-3 bg-[#111317] border border-[#333A48] rounded text-[11px] text-[#859399]">
                  <span className="text-[#00D1FF] font-bold">AI Note:</span> Automatic computer-vision defect detection and acoustic anomaly logging will stream into RailRakshak in real-time.
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setNewInspectionModalOpen(false)}
                    className="px-4 py-2 rounded bg-[#333539] hover:bg-[#3C494E] text-[#E2E2E8] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-[#00D1FF] hover:bg-[#4CD6FF] text-[#001F28] font-bold transition-all shadow-[0_0_12px_rgba(0,209,255,0.3)]"
                  >
                    Confirm & Dispatch
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
