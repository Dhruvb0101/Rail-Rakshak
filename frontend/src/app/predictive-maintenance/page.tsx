'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Clock,
  Calendar,
  Layers,
  Activity,
  FileCheck,
  CheckCircle2,
  X,
  Plus,
  ArrowRight,
  ShieldAlert,
  CloudRain,
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
import { PREDICTIVE_RISKS } from '@/lib/mockData';
import { PredictiveRisk } from '@/lib/types';

export default function PredictiveMaintenancePage() {
  const [risks, setRisks] = useState<PredictiveRisk[]>(PREDICTIVE_RISKS);
  const [selectedRisk, setSelectedRisk] = useState<PredictiveRisk>(PREDICTIVE_RISKS[0]);
  const [activeHorizon, setActiveHorizon] = useState<'7d' | '30d' | '90d'>('30d');
  const [isWorkOrderModalOpen, setIsWorkOrderModalOpen] = useState(false);
  const [workOrderSuccess, setWorkOrderSuccess] = useState<string | null>(null);

  // Form State
  const [assignedGang, setAssignedGang] = useState('Track Machine Division (TMM Gang #4)');
  const [targetDate, setTargetDate] = useState('2026-08-20');
  const [remediationProtocol, setRemediationProtocol] = useState(
    'Thermite weld excision and flash-butt welding replacement with rail stress neutralization.'
  );

  const handleCreateWorkOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setRisks((prev) =>
      prev.map((r) => (r.id === selectedRisk.id ? { ...r, status: 'work_order_created' } : r))
    );
    setSelectedRisk((prev) => ({ ...prev, status: 'work_order_created' }));
    setIsWorkOrderModalOpen(false);
    setWorkOrderSuccess(
      `Work Order #WO-${Math.floor(1000 + Math.random() * 9000)} created for ${selectedRisk.component} at ${selectedRisk.locationKm}`
    );
    setTimeout(() => setWorkOrderSuccess(null), 4500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#333A48]">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#E2E2E8] tracking-tight flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[#00D1FF]" />
            <span>AI Predictive Maintenance & Track Health Risk</span>
          </h1>
          <p className="text-xs lg:text-sm font-mono text-[#859399] mt-1">
            Machine-learned degradation forecasting, multi-modal risk scoring & work order scheduling.
          </p>
        </div>

        <button
          onClick={() => setIsWorkOrderModalOpen(true)}
          className="bg-[#00D1FF] hover:bg-[#4CD6FF] text-[#001F28] font-mono text-xs font-bold py-2.5 px-4 rounded flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(0,209,255,0.2)]"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>CREATE WORK ORDER</span>
        </button>
      </div>

      {/* Success Notification */}
      {workOrderSuccess && (
        <div className="p-3.5 bg-[#00A572]/20 border border-[#4EDEA3] rounded text-xs font-mono text-[#4EDEA3] flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 duration-150">
          <CheckCircle2 className="w-4 h-4" />
          <span>{workOrderSuccess}</span>
        </div>
      )}

      {/* Top Highlight: Critical AI Failure Probability Card with Weather Impact */}
      <div className="surface-level-1 rounded-xl border border-[#333A48] p-5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#EF4444]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Summary */}
          <div className="lg:col-span-8 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-[#93000A] text-[#FFB4AB] border border-[#FFB4AB]/30">
                CRITICAL INTERVENTION REQUIRED
              </span>
              <span className="text-xs font-mono text-[#859399]">
                Ref: {selectedRisk.id} • {selectedRisk.trackSection}
              </span>
            </div>

            <h2 className="text-xl lg:text-2xl font-bold text-[#E2E2E8]">
              {selectedRisk.riskTitle}: {selectedRisk.component} ({selectedRisk.locationKm})
            </h2>

            <p className="text-xs font-mono text-[#BBC9CF] leading-relaxed">
              Recommended Protocol: {selectedRisk.recommendedMaintenance}
            </p>

            {/* Weather Impact Transparent Factor Callout */}
            <div className="p-3 bg-[#111317] rounded-lg border border-[#333A48] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2 text-[#BBC9CF]">
                <CloudRain className="w-4 h-4 text-[#00D1FF]" />
                <span>Base Risk: <strong className="text-[#E2E2E8]">{selectedRisk.baseRiskPct}%</strong></span>
                <span className="text-[#859399]">+</span>
                <span>Weather Impact: <strong className="text-[#00D1FF]">+{selectedRisk.weatherImpactPct}%</strong> ({selectedRisk.weatherCondition})</span>
              </div>
              <div className="text-[#FFB4AB] font-bold">
                Final Track Risk: {selectedRisk.failureProbability}%
              </div>
            </div>
          </div>

          {/* Right Gauge & Critical Window */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 bg-[#111317] rounded-xl border border-[#333A48] text-center space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#859399]">
              Failure Probability
            </span>
            <div className="text-4xl lg:text-5xl font-bold font-sans text-[#EF4444] drop-shadow-[0_0_12px_rgba(239,68,68,0.4)]">
              {selectedRisk.failureProbability}%
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-[#FFB4AB] font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>Window: {selectedRisk.expectedWindowDays}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Degradation Horizon Curve + Multi-Factor Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recharts Degradation Curve (8 cols) */}
        <div className="lg:col-span-8 surface-level-1 rounded-xl border border-[#333A48] p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#333A48] pb-3">
            <h3 className="font-mono text-xs font-bold text-[#BBC9CF] uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#00D1FF]" />
              Multi-Horizon Track Degradation Trajectory
            </h3>

            {/* Time Horizon Toggles */}
            <div className="flex items-center gap-1 bg-[#111317] p-1 rounded border border-[#333A48] text-xs font-mono">
              {(['7d', '30d', '90d'] as const).map((horizon) => (
                <button
                  key={horizon}
                  onClick={() => setActiveHorizon(horizon)}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeHorizon === horizon
                      ? 'bg-[#00D1FF] text-[#001F28] font-bold'
                      : 'text-[#859399] hover:text-[#E2E2E8]'
                  }`}
                >
                  {horizon.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={selectedRisk.forecastCurve} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#859399" fontSize={11} fontFamily="JetBrains Mono" />
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
                <ReferenceLine y={75} stroke="#FFB044" strokeDasharray="3 3" label={{ value: 'Critical Threshold (75%)', fill: '#FFB044', fontSize: 10 }} />
                <Area type="monotone" dataKey="riskScore" stroke="#EF4444" strokeWidth={3} fill="url(#riskGrad)" name="Risk Score (%)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Contributing Sensory Factors (4 cols) */}
        <div className="lg:col-span-4 surface-level-1 rounded-xl border border-[#333A48] p-5 space-y-4">
          <h3 className="font-mono text-xs font-bold text-[#BBC9CF] uppercase tracking-wider flex items-center gap-2 border-b border-[#333A48] pb-3">
            <Layers className="w-4 h-4 text-[#00D1FF]" />
            Contributing Sensory Factors
          </h3>

          <div className="space-y-3">
            {selectedRisk.contributingFactors.map((factor, index) => (
              <div
                key={index}
                className="p-3 bg-[#111317] rounded-lg border border-[#333A48] space-y-1 font-mono text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[#E2E2E8] font-bold">{factor.factor}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                      factor.impact === 'critical'
                        ? 'bg-[#93000A] text-[#FFB4AB]'
                        : factor.impact === 'high'
                        ? 'bg-[#FFB044]/20 text-[#FFB044]'
                        : 'bg-[#4CD6FF]/20 text-[#00D1FF]'
                    }`}
                  >
                    {factor.impact}
                  </span>
                </div>
                <div className="text-[#00D1FF] font-mono text-[11px]">{factor.value}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setIsWorkOrderModalOpen(true)}
            className="w-full py-2.5 bg-[#1E2024] hover:bg-[#262B36] text-[#00D1FF] border border-[#00D1FF]/40 rounded font-mono text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <span>SCHEDULE REMEDIATION</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Work Order Modal */}
      {isWorkOrderModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1D24] border border-[#333A48] rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#333A48] pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#00D1FF]" />
                <h3 className="font-bold text-base text-[#E2E2E8]">Create Track Work Order</h3>
              </div>
              <button
                onClick={() => setIsWorkOrderModalOpen(false)}
                className="p-1 rounded text-[#859399] hover:bg-[#333539] hover:text-[#E2E2E8]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWorkOrder} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-[#859399] block mb-1">TARGET TRACK COMPONENT</label>
                <input
                  type="text"
                  readOnly
                  value={`${selectedRisk.component} (${selectedRisk.locationKm})`}
                  className="w-full bg-[#111317] border border-[#333A48] rounded p-2 text-[#E2E2E8]"
                />
              </div>

              <div>
                <label className="text-[#859399] block mb-1">ASSIGNED MAINTENANCE GANG</label>
                <input
                  type="text"
                  value={assignedGang}
                  onChange={(e) => setAssignedGang(e.target.value)}
                  className="w-full bg-[#111317] border border-[#333A48] rounded p-2 text-[#E2E2E8] focus:border-[#00D1FF] outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[#859399] block mb-1">TARGET COMPLETION DATE</label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full bg-[#111317] border border-[#333A48] rounded p-2 text-[#E2E2E8] focus:border-[#00D1FF] outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[#859399] block mb-1">REMEDIATION PROTOCOL</label>
                <textarea
                  rows={3}
                  value={remediationProtocol}
                  onChange={(e) => setRemediationProtocol(e.target.value)}
                  className="w-full bg-[#111317] border border-[#333A48] rounded p-2 text-[#E2E2E8] focus:border-[#00D1FF] outline-none resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#333A48]">
                <button
                  type="button"
                  onClick={() => setIsWorkOrderModalOpen(false)}
                  className="px-4 py-2 bg-[#1E2024] hover:bg-[#333539] text-[#BBC9CF] rounded font-bold"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00D1FF] hover:bg-[#4CD6FF] text-[#001F28] rounded font-bold shadow-[0_0_10px_rgba(0,209,255,0.2)]"
                >
                  DISPATCH WORK ORDER
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
