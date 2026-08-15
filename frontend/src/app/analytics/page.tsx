'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  BrainCircuit,
  PieChart as PieIcon,
  ShieldCheck,
  Calendar,
  Download,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const TREND_DATA_30D = [
  { date: 'Aug 01', cracks: 4, fasteners: 8, geometry: 2 },
  { date: 'Aug 05', cracks: 6, fasteners: 11, geometry: 1 },
  { date: 'Aug 09', cracks: 3, fasteners: 7, geometry: 4 },
  { date: 'Aug 12', cracks: 8, fasteners: 14, geometry: 3 },
  { date: 'Aug 15', cracks: 5, fasteners: 9, geometry: 2 },
];

const DEFECT_DISTRIBUTION = [
  { name: 'Rail Cracks (TF/Head Check)', value: 38, color: '#EF4444' },
  { name: 'Fastener Clip Anomalies', value: 24, color: '#FFB044' },
  { name: 'Concrete Sleeper Cracks', value: 18, color: '#00D1FF' },
  { name: 'Welded Joint Stress', value: 12, color: '#4EDEA3' },
  { name: 'Vegetation Encroachment', value: 5, color: '#A4E6FF' },
  { name: 'Gauge Misalignment', value: 3, color: '#FFD5A5' },
];

const AI_ACCURACY_TIMELINE = [
  { week: 'W1', accuracy: 94.2, precision: 93.5, recall: 92.0 },
  { week: 'W2', accuracy: 95.8, precision: 95.1, recall: 94.4 },
  { week: 'W3', accuracy: 97.4, precision: 96.8, recall: 95.9 },
  { week: 'W4', accuracy: 98.4, precision: 97.8, recall: 96.5 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '6m' | '1y'>('30d');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#333A48]">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#E2E2E8] tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#00D1FF]" />
            <span>Infrastructure Analytics & AI Performance</span>
          </h1>
          <p className="text-xs lg:text-sm font-mono text-[#859399] mt-1">
            Historical defect patterns, model accuracy drift & component failure frequencies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-[#1A1D24] hover:bg-[#262B36] text-[#BBC9CF] border border-[#333A48] rounded font-mono text-xs flex items-center gap-1.5 transition-colors">
            <Download className="w-3.5 h-3.5" />
            <span>Export Analytics CSV</span>
          </button>
        </div>
      </div>

      {/* AI Performance KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="surface-level-1 p-4 rounded-lg border border-[#333A48]">
          <span className="text-[11px] font-mono text-[#859399] uppercase">AI Model Accuracy</span>
          <div className="text-3xl font-bold font-sans text-[#00D1FF] my-1">98.4%</div>
          <span className="text-[10px] font-mono text-[#4EDEA3]">+1.2% over last cycle</span>
        </div>

        <div className="surface-level-1 p-4 rounded-lg border border-[#333A48]">
          <span className="text-[11px] font-mono text-[#859399] uppercase">Precision Rate</span>
          <div className="text-3xl font-bold font-sans text-[#4EDEA3] my-1">97.8%</div>
          <span className="text-[10px] font-mono text-[#859399]">ResNet-50-Rail (v2.4)</span>
        </div>

        <div className="surface-level-1 p-4 rounded-lg border border-[#333A48]">
          <span className="text-[11px] font-mono text-[#859399] uppercase">Defect Recall</span>
          <div className="text-3xl font-bold font-sans text-[#E2E2E8] my-1">96.5%</div>
          <span className="text-[10px] font-mono text-[#859399]">Zero missed critical fractures</span>
        </div>

        <div className="surface-level-1 p-4 rounded-lg border border-[#333A48]">
          <span className="text-[11px] font-mono text-[#859399] uppercase">False Positive Rate</span>
          <div className="text-3xl font-bold font-sans text-[#FFB044] my-1">1.6%</div>
          <span className="text-[10px] font-mono text-[#4EDEA3]">Low engineer intervention</span>
        </div>
      </div>

      {/* Defect Trends & Distribution Dual Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Defect Trends Area Chart (Spans 7 cols on xl) */}
        <div className="xl:col-span-7 surface-level-1 rounded-xl border border-[#333A48] p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="font-mono text-xs font-bold text-[#BBC9CF] uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#00D1FF]" />
              Defect Trend Occurrence Over Time
            </h3>

            <div className="flex items-center bg-[#111317] border border-[#333A48] rounded p-0.5 text-xs font-mono">
              {(['7d', '30d', '6m', '1y'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    timeRange === r
                      ? 'bg-[#00D1FF] text-[#001F28] font-bold'
                      : 'text-[#859399] hover:text-[#E2E2E8]'
                  }`}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TREND_DATA_30D}>
                <defs>
                  <linearGradient id="crackColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="fastenerColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFB044" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#FFB044" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#859399" fontSize={11} fontFamily="JetBrains Mono" />
                <YAxis stroke="#859399" fontSize={11} fontFamily="JetBrains Mono" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1D24',
                    borderColor: '#333A48',
                    borderRadius: '6px',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="cracks" name="Rail Cracks" stroke="#EF4444" strokeWidth={2} fill="url(#crackColor)" />
                <Area type="monotone" dataKey="fasteners" name="Fasteners" stroke="#FFB044" strokeWidth={2} fill="url(#fastenerColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Defect Distribution Pie Chart (Spans 5 cols on xl) */}
        <div className="xl:col-span-5 surface-level-1 rounded-xl border border-[#333A48] p-5 space-y-4">
          <h3 className="font-mono text-xs font-bold text-[#BBC9CF] uppercase tracking-wider flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-[#00D1FF]" />
            Defect Category Distribution (%)
          </h3>

          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DEFECT_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {DEFECT_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1D24',
                    borderColor: '#333A48',
                    borderRadius: '6px',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  wrapperStyle={{
                    fontSize: '11px',
                    fontFamily: 'JetBrains Mono',
                    color: '#BBC9CF',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
