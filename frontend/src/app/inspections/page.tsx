'use client';

import React, { useState } from 'react';
import {
  ClipboardCheck,
  Calendar,
  Clock,
  User,
  Truck,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Plus,
  X,
  FileText,
  Search,
} from 'lucide-react';
import { INSPECTIONS } from '@/lib/mockData';
import { Inspection, InspectionStatus } from '@/lib/types';

export default function InspectionsPage() {
  const [inspections, setInspections] = useState<Inspection[]>(INSPECTIONS);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);

  const filteredInspections = inspections.filter((ins) => {
    if (statusFilter === 'all') return true;
    return ins.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#333A48]">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#E2E2E8] tracking-tight">
            Track Inspections & Verification Logs
          </h1>
          <p className="text-xs lg:text-sm font-mono text-[#859399] mt-1">
            Automated Track Recording Cars (TRC), drone LiDAR surveys & foot-patrolling registers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedInspection(INSPECTIONS[0])}
            className="px-3.5 py-2 bg-[#00D1FF] hover:bg-[#4CD6FF] text-[#001F28] font-mono text-xs font-bold rounded flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(0,209,255,0.25)]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>NEW INSPECTION LOG</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center bg-[#1A1D24] p-1 rounded-lg border border-[#333A48] text-xs font-mono w-fit overflow-x-auto">
        {[
          { id: 'all', label: 'All Inspections' },
          { id: 'in_progress', label: 'In Progress (1)' },
          { id: 'scheduled', label: 'Scheduled (1)' },
          { id: 'completed', label: 'Completed (1)' },
          { id: 'overdue', label: 'Overdue (1)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
              statusFilter === tab.id
                ? 'bg-[#00D1FF] text-[#001F28] font-bold'
                : 'text-[#BBC9CF] hover:text-[#E2E2E8]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Inspections Table */}
      <div className="surface-level-1 rounded-xl border border-[#333A48] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#111317] text-[#859399] uppercase border-b border-[#333A48]">
              <tr>
                <th className="p-3.5">Inspection ID</th>
                <th className="p-3.5">Track Section</th>
                <th className="p-3.5">Inspector / Officer</th>
                <th className="p-3.5">Vehicle Type</th>
                <th className="p-3.5">Date & Slot</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Defects Found</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#333A48]">
              {filteredInspections.map((ins) => (
                <tr
                  key={ins.id}
                  onClick={() => setSelectedInspection(ins)}
                  className="interactive-row cursor-pointer text-[#E2E2E8]"
                >
                  <td className="p-3.5 font-bold text-[#00D1FF]">{ins.inspectionCode}</td>
                  <td className="p-3.5 max-w-xs truncate">{ins.trackSection}</td>
                  <td className="p-3.5">
                    <div className="font-bold text-[#E2E2E8]">{ins.inspectorName}</div>
                    <div className="text-[10px] text-[#859399]">{ins.inspectorRole}</div>
                  </td>
                  <td className="p-3.5 text-[#BBC9CF]">{ins.vehicleType}</td>
                  <td className="p-3.5">
                    <div>{ins.date}</div>
                    <div className="text-[10px] text-[#859399]">{ins.timeSlot}</div>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        ins.status === 'completed'
                          ? 'bg-[#00A572]/20 text-[#4EDEA3] border-[#4EDEA3]/40'
                          : ins.status === 'in_progress'
                          ? 'bg-[#00D1FF]/20 text-[#00D1FF] border-[#00D1FF]/40'
                          : ins.status === 'overdue'
                          ? 'bg-[#93000A] text-[#FFB4AB] border-[#FFB4AB]/40'
                          : 'bg-[#FFB044]/20 text-[#FFB044] border-[#FFB044]/40'
                      }`}
                    >
                      {ins.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={
                        ins.defectsFound > 0 ? 'text-[#FFB4AB] font-bold' : 'text-[#4EDEA3]'
                      }
                    >
                      {ins.defectsFound} defects ({ins.criticalCount} crit)
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button className="text-[#00D1FF] hover:underline flex items-center gap-1 ml-auto">
                      <span>View</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspection Detail Modal */}
      {selectedInspection && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1D24] border border-[#333A48] rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-[#111317] border-b border-[#333A48] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#E2E2E8] font-mono">
                  Inspection Details: {selectedInspection.inspectionCode}
                </h3>
                <p className="text-xs font-mono text-[#859399]">{selectedInspection.trackSection}</p>
              </div>
              <button
                onClick={() => setSelectedInspection(null)}
                className="text-[#859399] hover:text-[#E2E2E8]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-[#111317] rounded border border-[#333A48]">
                  <span className="text-[#859399] block">Inspector:</span>
                  <span className="text-[#E2E2E8] font-bold">{selectedInspection.inspectorName}</span>
                </div>
                <div className="p-3 bg-[#111317] rounded border border-[#333A48]">
                  <span className="text-[#859399] block">Equipment:</span>
                  <span className="text-[#E2E2E8] font-bold">{selectedInspection.vehicleType}</span>
                </div>
                <div className="p-3 bg-[#111317] rounded border border-[#333A48]">
                  <span className="text-[#859399] block">Compliance Score:</span>
                  <span className="text-[#4EDEA3] font-bold">{selectedInspection.complianceScorePct}%</span>
                </div>
              </div>

              <div className="p-3 bg-[#111317] rounded border border-[#333A48]">
                <span className="text-[#859399] block mb-1">Field Notes & Observations:</span>
                <p className="text-[#E2E2E8] leading-relaxed">{selectedInspection.notes}</p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedInspection(null)}
                  className="px-4 py-2 rounded bg-[#333539] hover:bg-[#3C494E] text-[#E2E2E8]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
