'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  UserCheck,
  ShieldAlert,
  ArrowUpRight,
  Filter,
  Search,
  X,
  Send,
} from 'lucide-react';
import { ALERTS } from '@/lib/mockData';
import { Alert, Severity } from '@/lib/types';

export default function AlertsPage() {
  const [alertsList, setAlertsList] = useState<Alert[]>(ALERTS);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalAlert, setActiveModalAlert] = useState<{
    alert: Alert;
    action: 'acknowledge' | 'assign' | 'escalate' | 'resolve';
  } | null>(null);
  const [assignedEngineerName, setAssignedEngineerName] = useState('Er. Rajesh Sharma');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredAlerts = alertsList.filter((alert) => {
    if (filterSeverity !== 'all' && alert.severity !== filterSeverity && filterSeverity !== alert.status) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        alert.title.toLowerCase().includes(q) ||
        alert.trackSection.toLowerCase().includes(q) ||
        alert.alertCode.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleActionConfirm = () => {
    if (!activeModalAlert) return;
    const { alert, action } = activeModalAlert;

    if (action === 'acknowledge') {
      setAlertsList((prev) =>
        prev.map((a) => (a.id === alert.id ? { ...a, status: 'acknowledged' } : a))
      );
      setToastMessage(`Alert ${alert.alertCode} acknowledged by control room.`);
    } else if (action === 'assign') {
      setAlertsList((prev) =>
        prev.map((a) =>
          a.id === alert.id ? { ...a, status: 'in_progress', assignedEngineer: assignedEngineerName } : a
        )
      );
      setToastMessage(`Dispatched ${alert.alertCode} to ${assignedEngineerName}.`);
    } else if (action === 'escalate') {
      setAlertsList((prev) =>
        prev.map((a) => (a.id === alert.id ? { ...a, severity: 'critical' } : a))
      );
      setToastMessage(`Alert ${alert.alertCode} escalated to Divisional Railway Manager (DRM).`);
    } else if (action === 'resolve') {
      setAlertsList((prev) =>
        prev.map((a) => (a.id === alert.id ? { ...a, status: 'resolved', resolvedAt: 'Just now' } : a))
      );
      setToastMessage(`Alert ${alert.alertCode} closed and marked resolved.`);
    }

    setActiveModalAlert(null);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#333A48]">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#E2E2E8] tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-[#FFB4AB]" />
            <span>Active Incident & Safety Alerts</span>
          </h1>
          <p className="text-xs font-mono text-[#859399] mt-1">
            Real-time track defect alerts, sensor thresholds & emergency safety escalations.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-[#93000A]/60 text-[#FFB4AB] border border-[#FFB4AB]/40 font-bold">
            3 CRITICAL OPEN
          </span>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-[#00A572]/20 border border-[#4EDEA3] rounded text-xs font-mono text-[#4EDEA3] flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Severity Tabs */}
        <div className="flex items-center bg-[#1A1D24] p-1 rounded-lg border border-[#333A48] text-xs font-mono overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Alerts' },
            { id: 'critical', label: 'Critical (3)' },
            { id: 'high', label: 'High' },
            { id: 'medium', label: 'Medium' },
            { id: 'low', label: 'Low' },
            { id: 'resolved', label: 'Resolved' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterSeverity(tab.id)}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                filterSeverity === tab.id
                  ? 'bg-[#00D1FF] text-[#001F28] font-bold'
                  : 'text-[#BBC9CF] hover:text-[#E2E2E8]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#859399]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by title, KM or ID..."
            className="w-full bg-[#1A1D24] border border-[#333A48] focus:border-[#00D1FF] rounded pl-9 pr-3 py-1.5 text-xs font-mono text-[#E2E2E8] placeholder-[#859399] focus:outline-none"
          />
        </div>
      </div>

      {/* Alerts Table / Cards List */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => {
          const isCrit = alert.severity === 'critical';
          const isHigh = alert.severity === 'high';
          const isResolved = alert.status === 'resolved';

          return (
            <div
              key={alert.id}
              className={`surface-level-1 p-4 rounded-xl border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                isCrit
                  ? 'border-l-4 border-l-[#EF4444] border-[#333A48] hover:border-[#EF4444]/60'
                  : isHigh
                  ? 'border-l-4 border-l-[#FFB044] border-[#333A48] hover:border-[#FFB044]/60'
                  : 'border-l-4 border-l-[#859399] border-[#333A48] hover:border-[#859399]/60'
              }`}
            >
              {/* Alert Information */}
              <div className="flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                      isCrit
                        ? 'bg-[#93000A] text-[#FFB4AB] border-[#FFB4AB]/40'
                        : isHigh
                        ? 'bg-[#FFB044]/20 text-[#FFB044] border-[#FFB044]/30'
                        : 'bg-[#333539] text-[#BBC9CF] border-[#333A48]'
                    }`}
                  >
                    {alert.severity}
                  </span>
                  <span className="text-xs font-mono text-[#859399]">{alert.alertCode}</span>
                  <span className="text-[#333A48]">•</span>
                  <span className="text-xs font-mono text-[#859399] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {alert.timestamp}
                  </span>
                  <span className="text-[#333A48]">•</span>
                  <span className="text-xs font-mono text-[#00D1FF]">
                    AI Confidence: {alert.aiConfidence}%
                  </span>
                </div>

                <h3 className="text-sm lg:text-base font-bold text-[#E2E2E8]">{alert.title}</h3>

                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#BBC9CF]">
                  <span>Track: <span className="text-[#E2E2E8]">{alert.trackSection}</span></span>
                  <span>Location: <span className="text-[#00D1FF] font-bold">KM {alert.locationKm}</span></span>
                  <span>Source: <span className="text-[#859399]">{alert.detectionSource}</span></span>
                  {alert.assignedEngineer && (
                    <span>Assigned: <span className="text-[#4EDEA3]">{alert.assignedEngineer}</span></span>
                  )}
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#333A48]">
                {alert.status === 'active' && (
                  <button
                    onClick={() => setActiveModalAlert({ alert, action: 'acknowledge' })}
                    className="px-3 py-1.5 rounded bg-[#333539] hover:bg-[#3C494E] text-[#E2E2E8] font-mono text-xs transition-colors"
                  >
                    Acknowledge
                  </button>
                )}

                {alert.status !== 'resolved' && (
                  <button
                    onClick={() => setActiveModalAlert({ alert, action: 'assign' })}
                    className="px-3 py-1.5 rounded bg-[#00D1FF]/20 hover:bg-[#00D1FF]/30 text-[#00D1FF] border border-[#00D1FF]/40 font-mono text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Assign Gang</span>
                  </button>
                )}

                {isCrit && alert.status !== 'resolved' && (
                  <button
                    onClick={() => setActiveModalAlert({ alert, action: 'escalate' })}
                    className="px-3 py-1.5 rounded bg-[#93000A]/40 hover:bg-[#93000A]/60 text-[#FFB4AB] border border-[#FFB4AB]/40 font-mono text-xs transition-colors"
                  >
                    Escalate (DRM)
                  </button>
                )}

                {alert.status !== 'resolved' ? (
                  <button
                    onClick={() => setActiveModalAlert({ alert, action: 'resolve' })}
                    className="px-3 py-1.5 rounded bg-[#00A572]/20 hover:bg-[#00A572]/40 text-[#4EDEA3] border border-[#4EDEA3]/40 font-mono text-xs font-bold transition-colors"
                  >
                    Resolve
                  </button>
                ) : (
                  <span className="px-3 py-1 rounded bg-[#00A572]/20 text-[#4EDEA3] font-mono text-xs font-bold">
                    RESOLVED
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      {activeModalAlert && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1D24] border border-[#333A48] rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-[#111317] border-b border-[#333A48] flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#E2E2E8] font-mono uppercase">
                Confirm Action: {activeModalAlert.action.toUpperCase()}
              </h3>
              <button
                onClick={() => setActiveModalAlert(null)}
                className="text-[#859399] hover:text-[#E2E2E8]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs font-mono">
              <div className="p-3 bg-[#111317] rounded border border-[#333A48]">
                <p className="text-[#859399]">Target Alert:</p>
                <p className="text-[#E2E2E8] font-bold mt-0.5">{activeModalAlert.alert.title}</p>
                <p className="text-[#00D1FF] text-[11px] mt-0.5">{activeModalAlert.alert.trackSection}</p>
              </div>

              {activeModalAlert.action === 'assign' && (
                <div>
                  <label className="block text-[#BBC9CF] mb-1">Assign Lead Engineer</label>
                  <input
                    type="text"
                    value={assignedEngineerName}
                    onChange={(e) => setAssignedEngineerName(e.target.value)}
                    className="w-full bg-[#111317] border border-[#333A48] focus:border-[#00D1FF] rounded px-3 py-2 text-[#E2E2E8] focus:outline-none"
                  />
                </div>
              )}

              <p className="text-[#BBC9CF] leading-relaxed">
                {activeModalAlert.action === 'acknowledge' &&
                  'Acknowledge that railway dispatch control is aware of this safety alert.'}
                {activeModalAlert.action === 'assign' &&
                  'Dispatch repair team and issue caution order to passing locomotives.'}
                {activeModalAlert.action === 'escalate' &&
                  'Immediately notify DRM and impose emergency track speed block.'}
                {activeModalAlert.action === 'resolve' &&
                  'Verify trackman inspection report before marking this critical alert as resolved.'}
              </p>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setActiveModalAlert(null)}
                  className="px-4 py-2 rounded bg-[#333539] hover:bg-[#3C494E] text-[#E2E2E8]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleActionConfirm}
                  className="px-4 py-2 rounded bg-[#00D1FF] hover:bg-[#4CD6FF] text-[#001F28] font-bold shadow-[0_0_12px_rgba(0,209,255,0.3)]"
                >
                  Confirm & Execute
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
