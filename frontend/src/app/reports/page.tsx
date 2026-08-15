'use client';

import React, { useState } from 'react';
import {
  FileText,
  Download,
  Eye,
  Share2,
  Calendar,
  Sparkles,
  CheckCircle2,
  X,
  Printer,
  Plus,
} from 'lucide-react';
import { REPORTS } from '@/lib/mockData';
import { ReportItem } from '@/lib/types';

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>(REPORTS);
  const [previewReport, setPreviewReport] = useState<ReportItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = (type: ReportItem['reportType'], title: string) => {
    setIsGenerating(true);
    setTimeout(() => {
      const newReport: ReportItem = {
        id: `REP-${Date.now().toString().slice(-6)}`,
        title,
        reportType: type,
        division: 'Delhi Division',
        period: 'Current Shift',
        generatedAt: 'Just now',
        generatedBy: 'AI System Autonomous Engine',
        fileFormat: 'PDF',
        fileSizeMb: 3.4,
        summaryMetrics: {
          inspectionsCompleted: 6,
          defectsIdentified: 11,
          criticalAlerts: 1,
          averageHealthScore: 95.2,
        },
      };
      setReports((prev) => [newReport, ...prev]);
      setIsGenerating(false);
      setToastMessage(`Generated new report: ${title}`);
      setTimeout(() => setToastMessage(null), 3500);
    }, 1000);
  };

  const handleDownload = (report: ReportItem) => {
    setToastMessage(`Downloading ${report.title} (${report.fileFormat})...`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#333A48]">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#E2E2E8] tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#00D1FF]" />
            <span>Official Safety & Operational Reports</span>
          </h1>
          <p className="text-xs lg:text-sm font-mono text-[#859399] mt-1">
            Automated compliance audits, track health indices & AI detection summaries for Northern Railway.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleGenerateReport('daily_safety', 'Instant Real-time Safety Audit')}
            disabled={isGenerating}
            className="px-3.5 py-2 bg-[#00D1FF] hover:bg-[#4CD6FF] text-[#001F28] font-mono text-xs font-bold rounded flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(0,209,255,0.25)]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{isGenerating ? 'COMPILING REPORT...' : 'GENERATE AUDIT'}</span>
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

      {/* Quick Generate Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { type: 'daily_safety' as const, title: 'Daily Safety Report', desc: 'Summary of 24h incidents, caution orders & patrol logs.' },
          { type: 'track_health' as const, title: 'Track Health Report', desc: 'Composite health breakdown & geometry deviations.' },
          { type: 'ai_detection' as const, title: 'AI Defect Audit', desc: 'Computer vision logs, confidence metrics & verifications.' },
          { type: 'predictive_maintenance' as const, title: 'Predictive 30-Day Outlook', desc: 'Failure probability models & planned work orders.' },
        ].map((item) => (
          <div
            key={item.title}
            className="surface-level-1 p-4 rounded-lg border border-[#333A48] flex flex-col justify-between"
          >
            <div>
              <h4 className="text-xs font-bold text-[#E2E2E8] font-mono">{item.title}</h4>
              <p className="text-[11px] font-mono text-[#859399] mt-1">{item.desc}</p>
            </div>
            <button
              onClick={() => handleGenerateReport(item.type, item.title)}
              className="mt-3 py-1.5 px-3 bg-[#111317] hover:bg-[#262B36] text-[#00D1FF] border border-[#333A48] rounded text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate Now</span>
            </button>
          </div>
        ))}
      </div>

      {/* Reports Archive Table */}
      <div className="surface-level-1 rounded-xl border border-[#333A48] overflow-hidden">
        <div className="p-4 bg-[#111317] border-b border-[#333A48]">
          <h3 className="font-mono text-xs font-bold text-[#BBC9CF] uppercase tracking-wider">
            Generated Reports Archive
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#1E2024] text-[#859399] uppercase border-b border-[#333A48]">
              <tr>
                <th className="p-3.5">Report Title</th>
                <th className="p-3.5">Division / Region</th>
                <th className="p-3.5">Coverage Period</th>
                <th className="p-3.5">Generated At</th>
                <th className="p-3.5">Format & Size</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#333A48]">
              {reports.map((rep) => (
                <tr key={rep.id} className="interactive-row text-[#E2E2E8]">
                  <td className="p-3.5">
                    <div className="font-bold text-[#E2E2E8] flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#00D1FF]" />
                      <span>{rep.title}</span>
                    </div>
                    <div className="text-[10px] text-[#859399]">Author: {rep.generatedBy}</div>
                  </td>
                  <td className="p-3.5 text-[#BBC9CF]">{rep.division}</td>
                  <td className="p-3.5 text-[#BBC9CF]">{rep.period}</td>
                  <td className="p-3.5 text-[#859399]">{rep.generatedAt}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#333539] text-[#00D1FF] border border-[#333A48]">
                      {rep.fileFormat} • {rep.fileSizeMb} MB
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setPreviewReport(rep)}
                        className="p-1.5 hover:bg-[#333539] rounded text-[#00D1FF] transition-colors"
                        title="Preview Report"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(rep)}
                        className="p-1.5 hover:bg-[#333539] rounded text-[#4EDEA3] transition-colors"
                        title="Download Document"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Preview Modal */}
      {previewReport && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1D24] border border-[#333A48] rounded-xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 bg-[#111317] border-b border-[#333A48] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#00D1FF]" />
                <div>
                  <h3 className="text-sm font-bold text-[#E2E2E8] font-mono">{previewReport.title}</h3>
                  <p className="text-[10px] font-mono text-[#859399]">
                    Northern Railway • {previewReport.division} • {previewReport.period}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewReport(null)}
                className="text-[#859399] hover:text-[#E2E2E8]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Content View */}
            <div className="p-6 space-y-5 text-xs font-mono bg-[#0C0E12] max-h-[70vh] overflow-y-auto">
              <div className="border-b border-[#333A48] pb-4 flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold text-[#A4E6FF]">GOVERNMENT OF INDIA • MINISTRY OF RAILWAYS</h2>
                  <p className="text-[#859399] text-[11px] mt-0.5">NORTHERN RAILWAY HEADQUARTERS • DELHI DIVISION</p>
                  <p className="text-[#00D1FF] text-[11px] mt-1 font-bold">RAILRAKSHAK AI SAFETY AUDIT REPORT</p>
                </div>
                <div className="text-right text-[11px] text-[#859399]">
                  <p>Document ID: {previewReport.id}</p>
                  <p>Generated: {previewReport.generatedAt}</p>
                </div>
              </div>

              {/* Key Summary Box */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-[#111317] rounded-lg border border-[#333A48]">
                <div>
                  <span className="text-[#859399] block text-[10px]">INSPECTIONS</span>
                  <span className="text-base font-bold text-[#E2E2E8]">
                    {previewReport.summaryMetrics?.inspectionsCompleted || 8}
                  </span>
                </div>
                <div>
                  <span className="text-[#859399] block text-[10px]">DEFECTS FOUND</span>
                  <span className="text-base font-bold text-[#FFB4AB]">
                    {previewReport.summaryMetrics?.defectsIdentified || 14}
                  </span>
                </div>
                <div>
                  <span className="text-[#859399] block text-[10px]">CRITICAL ORDERS</span>
                  <span className="text-base font-bold text-[#EF4444]">
                    {previewReport.summaryMetrics?.criticalAlerts || 3}
                  </span>
                </div>
                <div>
                  <span className="text-[#859399] block text-[10px]">AVERAGE HEALTH</span>
                  <span className="text-base font-bold text-[#4EDEA3]">
                    {previewReport.summaryMetrics?.averageHealthScore || 94.8}%
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-[#BBC9CF] leading-relaxed">
                <h4 className="font-bold text-[#E2E2E8] uppercase text-[11px]">1. Executive Safety Summary</h4>
                <p>
                  During the monitoring window, computer-vision scanning units and acoustic emission networks continuously analyzed track corridors across Delhi Division. All critical rail fractures have been quarantined with automated caution speed restrictions.
                </p>

                <h4 className="font-bold text-[#E2E2E8] uppercase text-[11px] pt-2">2. Priority Action Directives</h4>
                <p>
                  1. Execute urgent thermite weld replacement at KM 142.6 (New Delhi – Ghaziabad Mainline Up) within 14-day intervention horizon.
                </p>
                <p>
                  2. Deploy Ballast Cleaning Machine (BCM) on Tuglakabad Yard siding to address moisture saturation.
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-[#111317] border-t border-[#333A48] flex justify-between items-center">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-3 py-1.5 bg-[#333539] hover:bg-[#3C494E] text-[#E2E2E8] rounded font-mono text-xs flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Document</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setPreviewReport(null)}
                  className="px-3 py-1.5 rounded bg-[#333539] hover:bg-[#3C494E] text-[#E2E2E8] font-mono text-xs"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleDownload(previewReport);
                    setPreviewReport(null);
                  }}
                  className="px-4 py-1.5 rounded bg-[#00D1FF] hover:bg-[#4CD6FF] text-[#001F28] font-mono text-xs font-bold shadow-[0_0_12px_rgba(0,209,255,0.3)]"
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
