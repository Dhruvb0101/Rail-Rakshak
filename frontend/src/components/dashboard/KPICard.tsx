'use client';

import React from 'react';
import { LucideIcon, TrendingUp, AlertTriangle, Route, ShieldCheck, Cpu } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  badgeText?: string;
  badgeVariant?: 'success' | 'warning' | 'error' | 'primary' | 'neutral';
  trendText?: string;
  trendPositive?: boolean;
  progressBarPct?: number;
  valueColor?: string;
}

export function KPICard({
  title,
  value,
  unit,
  icon: Icon,
  badgeText,
  badgeVariant = 'neutral',
  trendText,
  trendPositive = true,
  progressBarPct,
  valueColor = 'text-[#E2E2E8]',
}: KPICardProps) {
  const getBadgeStyle = () => {
    switch (badgeVariant) {
      case 'error':
        return 'bg-[#93000A]/60 text-[#FFB4AB] border-[#FFB4AB]/40';
      case 'warning':
        return 'bg-[#FFB044]/20 text-[#FFB044] border-[#FFB044]/40';
      case 'success':
        return 'bg-[#00A572]/20 text-[#4EDEA3] border-[#4EDEA3]/40';
      case 'primary':
        return 'bg-[#00D1FF]/20 text-[#00D1FF] border-[#00D1FF]/40';
      default:
        return 'bg-[#333539] text-[#BBC9CF] border-[#333A48]';
    }
  };

  return (
    <div className="surface-level-1 p-4 rounded-lg flex flex-col justify-between border border-[#333A48] hover:border-[#4CD6FF]/40 transition-all group min-h-[140px]">
      <div className="flex justify-between items-start">
        <span className="font-mono text-xs text-[#BBC9CF] tracking-wide uppercase">{title}</span>
        <div className="p-1.5 rounded bg-[#111317] border border-[#333A48] text-[#859399] group-hover:text-[#00D1FF] transition-colors">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="my-1">
        <div className={`text-3xl lg:text-4xl font-bold tracking-tight font-sans ${valueColor}`}>
          {value}
          {unit && <span className="text-sm font-normal text-[#859399] ml-1 font-mono">{unit}</span>}
        </div>
      </div>

      <div className="mt-auto pt-1">
        {progressBarPct !== undefined ? (
          <div className="w-full">
            <div className="flex justify-between text-[10px] font-mono text-[#859399] mb-1">
              <span>DAILY CAPACITY</span>
              <span className="text-[#00D1FF] font-bold">{progressBarPct}%</span>
            </div>
            <div className="w-full bg-[#333539] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#00D1FF] h-full rounded-full transition-all duration-500"
                style={{ width: `${progressBarPct}%` }}
              />
            </div>
          </div>
        ) : badgeText ? (
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${getBadgeStyle()}`}
            >
              {badgeText}
            </span>
          </div>
        ) : trendText ? (
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <TrendingUp
              className={`w-3.5 h-3.5 ${trendPositive ? 'text-[#4EDEA3]' : 'text-[#FFB4AB]'}`}
            />
            <span className={trendPositive ? 'text-[#4EDEA3]' : 'text-[#FFB4AB]'}>{trendText}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
