'use client';

import React, { useState } from 'react';
import {
  Search,
  Bell,
  Cloud,
  HardDrive,
  X,
  AlertTriangle,
  CheckCircle2,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { UserRole, SystemAlert } from '@/lib/types';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  alerts: SystemAlert[];
  onAlertClick: (alert: SystemAlert) => void;
  isAwsCloudMode: boolean;
  onToggleCloudMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  userRole,
  onRoleChange,
  alerts,
  onAlertClick,
  isAwsCloudMode,
  onToggleCloudMode,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <header className="relative sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-gray-200/80 px-6 py-3 flex items-center justify-between shadow-2xs">
      {/* Global Search input matching screenshot */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search locations, bins, buildings, or reports..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-gray-50/90 hover:bg-gray-100/60 focus:bg-white rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden transition-all text-gray-800 placeholder:text-gray-400"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4 ml-4">
        {/* Cloud / Local mode switch button */}
        <button
          onClick={onToggleCloudMode}
          title="Toggle AWS Cloud Connection vs Local Demo Mode"
          className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            isAwsCloudMode
              ? 'bg-emerald-50/80 text-emerald-800 border-emerald-200 hover:bg-emerald-100/70'
              : 'bg-amber-50/80 text-amber-800 border-amber-200 hover:bg-amber-100/70'
          }`}
        >
          {isAwsCloudMode ? (
            <>
              <Cloud className="w-3.5 h-3.5 text-emerald-600" />
              <span>AWS Cloud Mode (Live)</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
            </>
          ) : (
            <>
              <HardDrive className="w-3.5 h-3.5 text-amber-600" />
              <span>Local Demo Mode</span>
              <span className="w-2 h-2 rounded-full bg-amber-500 ml-0.5" />
            </>
          )}
        </button>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 rounded-xl transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 pb-2 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                  <span className="text-[11px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    onClick={() => {
                      onAlertClick(alert);
                      setShowNotifications(false);
                    }}
                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-start gap-3 transition-colors ${
                      !alert.read ? 'bg-emerald-50/30' : ''
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        alert.color === 'red'
                          ? 'bg-rose-100 text-rose-600'
                          : alert.color === 'amber'
                          ? 'bg-amber-100 text-amber-600'
                          : alert.color === 'green'
                          ? 'bg-emerald-100 text-emerald-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}
                    >
                      {alert.color === 'red' && <AlertTriangle className="w-3.5 h-3.5" />}
                      {alert.color === 'amber' && <AlertTriangle className="w-3.5 h-3.5" />}
                      {alert.color === 'green' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {alert.color === 'blue' && <FileText className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 truncate">
                        {alert.title}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {alert.subtitle}
                      </p>
                    </div>
                    {!alert.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile matching screenshot: Avatar + Pushkar + Admin */}
        <div
          onClick={() => setShowRoleModal(!showRoleModal)}
          className="flex items-center gap-2.5 pl-2 cursor-pointer group"
          title="Switch User Role"
        >
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-xs">
              <div className="w-full h-full rounded-full bg-gray-900 overflow-hidden flex items-center justify-center text-white text-xs font-bold">
                <span>PK</span>
              </div>
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors leading-tight">
              Pushkar
            </p>
            <p className="text-[11px] text-gray-500 font-medium leading-none mt-0.5">
              {userRole}
            </p>
          </div>
        </div>
      </div>

      {/* Role Switcher Dropdown */}
      {showRoleModal && (
        <div className="absolute right-6 top-14 z-50 bg-white rounded-2xl max-w-sm w-80 sm:w-96 p-4 shadow-2xl border border-gray-100 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="font-semibold text-gray-900 text-sm">Select User Persona</h3>
            </div>
            <button
              onClick={() => setShowRoleModal(false)}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[11px] text-gray-500 mt-2 mb-3">
            Switch roles to experience role-based access control (RBAC) features:
          </p>
          <div className="space-y-2">
            {(['Admin', 'Facility Manager', 'Collection Team', 'Analyst'] as UserRole[]).map(
              (role) => (
                <button
                  key={role}
                  onClick={() => {
                    onRoleChange(role);
                    setShowRoleModal(false);
                  }}
                  className={`w-full p-2.5 text-left rounded-xl border flex items-center justify-between text-xs font-medium transition-all ${
                    userRole === role
                      ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 font-semibold ring-1 ring-emerald-500'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div>
                    <span className="block text-xs font-semibold">{role}</span>
                    <span className="text-[10px] text-gray-500">
                      {role === 'Admin' && 'Full privileges, AWS architecture & CDK config'}
                      {role === 'Facility Manager' && 'Building energy, anomaly tickets & thresholds'}
                      {role === 'Collection Team' && 'Driver dispatch, route execution & bin logs'}
                      {role === 'Analyst' && 'ESG reporting, carbon offsets & CSV exports'}
                    </span>
                  </div>
                  {userRole === role && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
};
