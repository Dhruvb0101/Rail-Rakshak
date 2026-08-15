'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Menu,
  Bell,
  Settings,
  Search,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  User,
  Shield,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { ALERTS } from '@/lib/mockData';
import { UserRole } from '@/lib/types';

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export function Header({ onOpenMobileMenu }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState('Delhi Division (Northern Railway)');
  const [currentRole, setCurrentRole] = useState<UserRole>('Chief Engineer');
  const [searchQuery, setSearchQuery] = useState('');

  const activeAlerts = ALERTS.filter((a) => a.status === 'active' || a.status === 'in_progress');

  return (
    <header className="sticky top-0 z-30 h-16 w-full bg-[#111317] border-b border-[#333A48] px-4 lg:px-6 flex items-center justify-between">
      {/* Left: Mobile Menu & Division Context */}
      <div className="flex items-center gap-3 lg:gap-5">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-[#BBC9CF] hover:text-[#00D1FF] hover:bg-[#1E2024] rounded"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#859399]">
            <Radio className="w-3.5 h-3.5 text-[#00D1FF] animate-pulse" />
            <span className="text-[#BBC9CF]">ZONE:</span>
            <span className="text-[#E2E2E8] font-bold">NR</span>
            <span className="text-[#333A48]">/</span>
          </div>

          <div className="relative group">
            <button className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#1A1D24] border border-[#333A48] hover:border-[#00D1FF]/50 transition-colors text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-[#4EDEA3]" />
              <span className="text-[#A4E6FF] font-bold">{selectedDivision}</span>
              <ChevronDown className="w-3 h-3 text-[#859399]" />
            </button>
          </div>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#859399]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search KM markers, sensor IDs, alerts (e.g. KM 142.6)..."
            className="w-full bg-[#1E2024] border border-[#333A48] focus:border-[#00D1FF] rounded px-3 pl-9 py-1.5 text-xs font-mono text-[#E2E2E8] placeholder-[#859399]/70 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <Link
              href={`/ai-detection?q=${encodeURIComponent(searchQuery)}`}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono bg-[#00D1FF]/20 text-[#00D1FF] px-1.5 py-0.5 rounded border border-[#00D1FF]/40"
            >
              SCAN
            </Link>
          )}
        </div>
      </div>

      {/* Right: Telemetry pill, Notifications, Settings, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live Telemetry Indicator */}
        <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded bg-[#1E2024] border border-[#333A48] text-[11px] font-mono">
          <span className="w-2 h-2 rounded-full bg-[#4EDEA3] animate-pulse" />
          <span className="text-[#859399]">TELEMETRY:</span>
          <span className="text-[#4EDEA3] font-bold">120 Hz</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative p-2 text-[#BBC9CF] hover:text-[#00D1FF] hover:bg-[#1E2024] rounded transition-colors"
          >
            <Bell className="w-4 h-4" />
            {activeAlerts.length > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FFB4AB] border-2 border-[#111317] rounded-full animate-ping" />
            )}
            {activeAlerts.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#1A1D24] border border-[#333A48] rounded-lg shadow-2xl z-50 overflow-hidden">
              <div className="p-3 bg-[#111317] border-b border-[#333A48] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#FFB044]" />
                  <span className="text-xs font-mono font-bold text-[#E2E2E8]">
                    Active Safety Alerts ({activeAlerts.length})
                  </span>
                </div>
                <Link
                  href="/alerts"
                  onClick={() => setShowNotifications(false)}
                  className="text-[11px] font-mono text-[#00D1FF] hover:underline"
                >
                  View All
                </Link>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#333A48]">
                {activeAlerts.map((alert) => (
                  <Link
                    key={alert.id}
                    href="/alerts"
                    onClick={() => setShowNotifications(false)}
                    className="p-3 block hover:bg-[#262B36] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                          alert.severity === 'critical'
                            ? 'bg-[#93000A] text-[#FFB4AB] border border-[#FFB4AB]/40'
                            : 'bg-[#FFB044]/20 text-[#FFB044] border border-[#FFB044]/30'
                        }`}
                      >
                        {alert.severity.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-mono text-[#859399]">{alert.timestamp}</span>
                    </div>
                    <p className="text-xs font-bold text-[#E2E2E8] mt-1.5">{alert.title}</p>
                    <p className="text-[11px] font-mono text-[#BBC9CF] mt-0.5">{alert.trackSection}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Settings link */}
        <Link
          href="/settings"
          className="p-2 text-[#BBC9CF] hover:text-[#00D1FF] hover:bg-[#1E2024] rounded transition-colors"
        >
          <Settings className="w-4 h-4" />
        </Link>

        {/* Profile Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#1E2024] border border-transparent hover:border-[#333A48] transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-[#00D1FF]/20 border border-[#00D1FF]/50 flex items-center justify-center text-[#00D1FF] text-xs font-bold font-mono">
              CE
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-bold text-[#E2E2E8]">Er. V. Singh</span>
              <span className="text-[10px] font-mono text-[#00D1FF]">{currentRole}</span>
            </div>
            <ChevronDown className="w-3 h-3 text-[#859399] hidden lg:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-[#1A1D24] border border-[#333A48] rounded-lg shadow-2xl z-50 p-2 text-xs font-mono">
              <div className="p-2 border-b border-[#333A48] mb-1">
                <p className="font-bold text-[#E2E2E8]">Er. Vikramaditya Singh</p>
                <p className="text-[10px] text-[#859399]">Sr. Divisional Engineer (Track)</p>
                <p className="text-[10px] text-[#00D1FF] mt-0.5">Northern Railway • Delhi</p>
              </div>

              <div className="py-1">
                <p className="text-[10px] text-[#859399] px-2 py-1 uppercase tracking-wider">
                  Switch Active Role
                </p>
                {(['Chief Engineer', 'Field Inspector', 'Safety Officer', 'Admin'] as UserRole[]).map(
                  (role) => (
                    <button
                      key={role}
                      onClick={() => {
                        setCurrentRole(role);
                        setShowProfileMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between hover:bg-[#262B36] ${
                        currentRole === role ? 'text-[#00D1FF] font-bold' : 'text-[#BBC9CF]'
                      }`}
                    >
                      <span>{role}</span>
                      {currentRole === role && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                  )
                )}
              </div>

              <div className="pt-2 border-t border-[#333A48] mt-1">
                <Link
                  href="/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-2.5 py-1.5 text-[#BBC9CF] hover:text-[#E2E2E8] hover:bg-[#262B36] rounded"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Security & Permissions</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
