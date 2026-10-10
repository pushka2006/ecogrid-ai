'use client';

import React from 'react';
import Image from 'next/image';
import {
  LayoutDashboard,
  ScanLine,
  Trash2,
  Truck,
  Zap,
  Sun,
  Leaf,
  FileText,
  Bot,
  Settings,
  Navigation,
} from 'lucide-react';

export type NavTabId =
  | 'dashboard'
  | 'realtime'
  | 'classification'
  | 'bins'
  | 'routing'
  | 'energy'
  | 'renewable'
  | 'sustainability'
  | 'reports'
  | 'assistant'
  | 'administration';

interface SidebarProps {
  activeTab: NavTabId;
  onTabChange: (tab: NavTabId) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'realtime' as const, label: 'Real-Time GPS Tracker', icon: Navigation },
    { id: 'classification' as const, label: 'Waste Classification', icon: ScanLine },
    { id: 'bins' as const, label: 'Bin Monitoring', icon: Trash2 },
    { id: 'routing' as const, label: 'Collection & Routing', icon: Truck },
    { id: 'energy' as const, label: 'Energy Monitoring', icon: Zap },
    { id: 'renewable' as const, label: 'Renewable Energy', icon: Sun },
    { id: 'sustainability' as const, label: 'Sustainability Impact', icon: Leaf },
    { id: 'reports' as const, label: 'Reports', icon: FileText },
    { id: 'assistant' as const, label: 'AI Assistant', icon: Bot },
    { id: 'administration' as const, label: 'Administration', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#032e20] text-emerald-100 flex flex-col shrink-0 h-screen sticky top-0 border-r border-[#053d2b] shadow-xl z-20 overflow-hidden">
      {/* Brand header at the top of the sidebar matching the screenshot */}
      <div className="p-5 pb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-950/40 shrink-0">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 12" />
            </svg>
          </div>
          <div className="overflow-hidden">
            <h1 className="text-xl font-bold text-white tracking-tight leading-tight">
              EcoGrid AI
            </h1>
            <p className="text-[10px] text-emerald-300/80 font-medium tracking-tight whitespace-nowrap mt-0.5">
              Smarter Waste • Cleaner Energy • Greener Tomorrow
            </p>
          </div>
        </div>
      </div>

      {/* Navigation links list */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto min-h-0 custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                isActive
                  ? 'bg-[#0a4c35] text-white shadow-sm ring-1 ring-emerald-500/30'
                  : 'text-emerald-100/70 hover:text-white hover:bg-[#073c2a]'
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-colors ${
                  isActive ? 'text-emerald-400' : 'text-emerald-300/60'
                }`}
              />
              <span className="truncate">{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Promo Card matching screenshot */}
      <div className="p-3.5 m-3 shrink-0 rounded-2xl bg-[#063f2d] border border-emerald-600/20 text-emerald-100 relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-300">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
            </span>
            <span className="text-[11px] font-bold text-white tracking-wide">
              Small actions.
            </span>
          </div>
          <p className="text-xs font-extrabold text-white tracking-tight leading-tight">
            Big impact.
          </p>

          <div className="my-2 rounded-xl overflow-hidden shadow-inner border border-emerald-500/20 aspect-4/3 relative">
            <Image
              src="/sidebar_card.jpg"
              alt="Together for a cleaner, greener planet"
              fill
              sizes="240px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-200/90 font-medium">
            <div className="w-5 h-5 rounded-full bg-emerald-500/30 flex items-center justify-center shrink-0">
              <Leaf className="w-2.5 h-2.5 text-emerald-300" />
            </div>
            <p className="leading-tight text-[10px]">
              Together for a cleaner, greener planet.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
