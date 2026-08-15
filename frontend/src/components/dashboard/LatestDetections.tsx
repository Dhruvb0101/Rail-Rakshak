'use client';

import React from 'react';
import Link from 'next/link';
import { BrainCircuit, AlertCircle, AlertTriangle, CheckCircle2, ChevronRight, ArrowRight } from 'lucide-react';
import { AI_DETECTIONS } from '@/lib/mockData';

export function LatestDetections() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center px-1 mb-3">
        <h3 className="text-base font-bold text-[#E2E2E8] flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-[#00D1FF]" />
          <span>Latest AI Detections</span>
        </h3>
        <Link
          href="/ai-detection"
          className="text-xs font-mono text-[#00D1FF] hover:underline flex items-center gap-1"
        >
          <span>View All</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Detection Cards List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {AI_DETECTIONS.map((detection) => {
          const isCritical = detection.severity === 'critical';
          const isHigh = detection.severity === 'high';
          const isRoutine = detection.severity === 'routine';

          // Segment bar calculation
          const filledSegments = Math.floor(detection.confidence / 20);
          const remainderPct = ((detection.confidence % 20) / 20) * 100;

          return (
            <Link
              key={detection.id}
              href={`/ai-detection?defectId=${detection.id}`}
              className={`surface-level-2 p-4 rounded-lg flex flex-col gap-3 interactive-row cursor-pointer border-l-4 transition-all block ${
                isCritical
                  ? 'border-l-[#EF4444] hover:border-[#EF4444]/60'
                  : isHigh
                  ? 'border-l-[#FFB044] hover:border-[#FFB044]/60'
                  : 'border-l-[#859399] hover:border-[#859399]/60'
              }`}
            >
              {/* Title & Status */}
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-bold text-[#E2E2E8]">{detection.defectType}</div>
                  <div className="text-xs text-[#BBC9CF] font-mono mt-0.5">
                    Loc: KM {detection.locationKm} ({detection.segmentCode})
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                    isCritical
                      ? 'bg-[#93000A]/60 text-[#FFB4AB] border-[#FFB4AB]/40'
                      : isHigh
                      ? 'bg-[#FFB044]/20 text-[#FFB044] border-[#FFB044]/30'
                      : 'bg-[#333539] text-[#BBC9CF] border-[#333A48]'
                  }`}
                >
                  {isCritical ? 'CRITICAL' : isHigh ? 'INVESTIGATE' : 'ROUTINE'}
                </span>
              </div>

              {/* Confidence Meter */}
              <div className="flex flex-col gap-1.5 mt-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#859399] text-[11px] font-mono">AI Confidence</span>
                  <span
                    className={`font-mono font-bold ${
                      isHigh ? 'text-[#FFB044]' : 'text-[#00D1FF]'
                    }`}
                  >
                    {detection.confidence}%
                  </span>
                </div>

                {/* 5-segment Progress Bar */}
                <div className="w-full bg-[#111317] h-2 rounded-full overflow-hidden flex gap-[2px] p-[1px] border border-[#333A48]">
                  {[0, 1, 2, 3, 4].map((segIndex) => {
                    const isFull = segIndex < filledSegments;
                    const isPartial = segIndex === filledSegments;
                    const barColor = isHigh ? 'bg-[#FFB044]' : 'bg-[#00D1FF]';

                    return (
                      <div
                        key={segIndex}
                        className="flex-1 bg-[#1E2024] h-full relative overflow-hidden rounded-[1px]"
                      >
                        {isFull && <div className={`w-full h-full ${barColor}`} />}
                        {isPartial && (
                          <div
                            className={`h-full ${barColor}`}
                            style={{ width: `${remainderPct}%` }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {detection.confidence < 70 && (
                  <span className="text-[10px] text-[#FFB044] font-mono mt-0.5 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-[#FFB044]" />
                    Human Verification Required
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
