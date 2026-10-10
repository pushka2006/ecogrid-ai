'use client';

import React from 'react';
import {
  Sun,
  ArrowRight,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { RenewableDaily } from '@/lib/types';

interface RenewableEnergyCardProps {
  weeklyData: RenewableDaily[];
  onViewDetails: () => void;
}

export const RenewableEnergyCard: React.FC<RenewableEnergyCardProps> = ({
  weeklyData,
  onViewDetails,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200/70 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sun className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Renewable Energy</h3>
          </div>
          <button
            onClick={onViewDetails}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group"
          >
            <span>View Details</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Top Half: Donut Gauge + Stats */}
        <div className="grid grid-cols-12 gap-3 items-center mb-4">
          {/* Donut Gauge (48%) */}
          <div className="col-span-5 flex flex-col items-center">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                {/* Background circle */}
                <path
                  className="text-gray-100"
                  strokeWidth="3.8"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* 48% progress circle */}
                <path
                  className="text-emerald-500"
                  strokeDasharray="48, 100"
                  strokeLinecap="round"
                  strokeWidth="3.8"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-black text-gray-900 leading-none">48%</span>
              </div>
            </div>
            <p className="text-[11px] font-bold text-gray-700 mt-1">Renewable Utilization</p>
            <p className="text-[10px] text-gray-400 font-medium">2,860 / 5,960 kWh</p>
          </div>

          {/* KPI Stats Right */}
          <div className="col-span-7 space-y-2.5 pl-2 border-l border-gray-100">
            {/* Solar Generation */}
            <div>
              <div className="flex items-center gap-1.5 text-gray-500 text-[11px] font-medium">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Solar Generation</span>
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-sm font-bold text-gray-900">2,860 kWh</span>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center">
                  <ArrowUpRight className="w-3 h-3" />
                  22%
                </span>
              </div>
              <p className="text-[9px] text-gray-400">vs last week</p>
            </div>

            {/* Grid Consumption */}
            <div>
              <div className="flex items-center gap-1.5 text-gray-500 text-[11px] font-medium">
                <Zap className="w-3.5 h-3.5 text-blue-500" />
                <span>Grid Consumption</span>
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-sm font-bold text-gray-900">3,120 kWh</span>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center">
                  <ArrowDownRight className="w-3 h-3" />
                  6%
                </span>
              </div>
              <p className="text-[9px] text-gray-400">vs last week</p>
            </div>
          </div>
        </div>

        {/* Bottom Half: Bar Chart Generation vs Consumption (kWh) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-semibold text-gray-600">Generation vs Consumption (kWh)</p>
            <div className="flex items-center gap-2 text-[10px] font-medium">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2 bg-emerald-500 rounded-xs" />
                <span className="text-gray-500">Solar Generation</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2 bg-blue-500 rounded-xs" />
                <span className="text-gray-500">Grid Consumption</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Canvas */}
          <div className="h-[90px] w-full">
            <svg viewBox="0 0 350 90" className="w-full h-full overflow-visible">
              {/* Y Grid lines */}
              <line x1="25" y1="20" x2="340" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="25" y1="45" x2="340" y2="45" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="25" y1="70" x2="340" y2="70" stroke="#f1f5f9" strokeWidth="1" />

              {/* Y Labels */}
              <text x="18" y="23" fontSize="8" fill="#94a3b8" textAnchor="end">6K</text>
              <text x="18" y="48" fontSize="8" fill="#94a3b8" textAnchor="end">4K</text>
              <text x="18" y="73" fontSize="8" fill="#94a3b8" textAnchor="end">2K</text>

              {/* Bar Groups for Mon to Sun */}
              {weeklyData.map((d, i) => {
                const groupX = 35 + i * 43;
                const maxVal = 4000;
                const solarHeight = (d.solarGenerationKwh / maxVal) * 55;
                const gridHeight = (d.gridConsumptionKwh / maxVal) * 55;

                return (
                  <g key={d.day}>
                    {/* Solar Bar (Green) */}
                    <rect
                      x={groupX}
                      y={75 - solarHeight}
                      width="10"
                      height={solarHeight}
                      rx="2"
                      fill="#10b981"
                    />
                    {/* Grid Bar (Blue) */}
                    <rect
                      x={groupX + 12}
                      y={75 - gridHeight}
                      width="10"
                      height={gridHeight}
                      rx="2"
                      fill="#3b82f6"
                    />
                    {/* X Day label */}
                    <text
                      x={groupX + 11}
                      y="86"
                      fontSize="8"
                      fontWeight="600"
                      fill="#64748b"
                      textAnchor="middle"
                    >
                      {d.day}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
