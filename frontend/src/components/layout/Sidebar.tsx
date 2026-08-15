'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Train,
  Video,
  Network,
  BrainCircuit,
  TrendingUp,
  Activity,
  AlertTriangle,
  ClipboardCheck,
  Radio,
  CloudRain,
  BarChart3,
  FileText,
  Settings,
  Plus,
  X,
  LucideIcon,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  badgeCritical?: boolean;
}

interface NavGroup {
  groupTitle: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    groupTitle: 'COMMAND',
    items: [
      { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Live Train Tracking', href: '/train-tracking', icon: Train, badge: '47 LIVE' },
      { label: 'Live Video Telemetry', href: '/live-monitoring', icon: Video },
      { label: 'Unified Network Map', href: '/network', icon: Network },
    ],
  },
  {
    groupTitle: 'AI & SAFETY',
    items: [
      { label: 'AI Defect Studio', href: '/ai-detection', icon: BrainCircuit },
      { label: 'Predictive Maintenance', href: '/predictive-maintenance', icon: TrendingUp },
      { label: 'Track Health', href: '/track-health', icon: Activity },
      { label: 'Safety Alerts', href: '/alerts', icon: AlertTriangle, badge: '17', badgeCritical: true },
    ],
  },
  {
    groupTitle: 'OPERATIONS',
    items: [
      { label: 'Inspections & TRC', href: '/inspections', icon: ClipboardCheck },
      { label: 'IoT Wayside Sensors', href: '/devices', icon: Radio },
      { label: 'Weather Intelligence', href: '/weather', icon: CloudRain, badge: 'RISK HIGH' },
    ],
  },
  {
    groupTitle: 'ANALYTICS',
    items: [
      { label: 'Analytics & Trends', href: '/analytics', icon: BarChart3 },
      { label: 'Official Reports', href: '/reports', icon: FileText },
    ],
  },
  {
    groupTitle: 'SYSTEM',
    items: [
      { label: 'Settings & Roles', href: '/settings', icon: Settings },
    ],
  },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onNewInspectionClick?: () => void;
}

export function Sidebar({ isOpen, onClose, onNewInspectionClick }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/' || pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <nav
        className={`fixed top-0 left-0 h-screen w-[320px] bg-[#1E2024] border-r border-[#333A48] flex flex-col py-4 px-3 z-50 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header / Brand */}
        <div className="flex items-center justify-between px-2 mb-4">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#00D1FF]/10 border border-[#00D1FF]/40 flex items-center justify-center text-[#00D1FF] shadow-[0_0_12px_rgba(0,209,255,0.2)]">
              <span className="material-symbols-outlined text-[24px]">train</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-[#A4E6FF] tracking-tight">RailRakshak</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#00D1FF]/20 text-[#00D1FF] rounded border border-[#00D1FF]/30 font-bold">
                  AI
                </span>
              </div>
              <p className="font-mono text-[10px] text-[#859399] uppercase tracking-wider">
                Industrial Command Center
              </p>
            </div>
          </Link>

          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded hover:bg-[#333539] text-[#BBC9CF]"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* CTA: New Inspection */}
        <button
          onClick={onNewInspectionClick}
          className="w-full bg-[#00D1FF] hover:bg-[#4CD6FF] text-[#001F28] font-mono text-[13px] font-bold py-2.5 px-4 rounded mb-4 flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(0,209,255,0.2)] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>NEW INSPECTION</span>
        </button>

        {/* Categorized Main Navigation Groups */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs font-mono">
          {NAV_GROUPS.map((group) => (
            <div key={group.groupTitle} className="space-y-1">
              <div className="px-3 text-[10px] font-bold text-[#859399] tracking-wider uppercase opacity-70">
                {group.groupTitle}
              </div>

              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center justify-between px-3 py-2 rounded transition-all group ${
                        active
                          ? 'text-[#A4E6FF] font-bold border-r-4 border-[#00D1FF] bg-[#4CD6FF]/10'
                          : 'text-[#BBC9CF] hover:bg-[#333539] hover:text-[#E2E2E8]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 transition-colors ${
                            active ? 'text-[#00D1FF]' : 'text-[#859399] group-hover:text-[#A4E6FF]'
                          }`}
                        />
                        <span className="text-[12px]">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                            item.badgeCritical
                              ? 'bg-[#93000A]/80 text-[#FFB4AB] border border-[#FFB4AB]/40'
                              : item.badge === '47 LIVE'
                              ? 'bg-[#00A572]/30 text-[#4EDEA3] border border-[#4EDEA3]/30'
                              : 'bg-[#FFB044]/20 text-[#FFB044] border border-[#FFB044]/30'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Status Bar */}
        <div className="mt-auto pt-3 border-t border-[#333A48] flex flex-col gap-1 text-[10px] font-mono text-[#859399]">
          <div className="px-3 py-2 bg-[#111317] rounded border border-[#333A48] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#4EDEA3] animate-pulse" />
              <span>LIVE SYSTEM</span>
            </div>
            <span className="text-[#00D1FF]">v2.5.0</span>
          </div>
        </div>
      </nav>
    </>
  );
}
