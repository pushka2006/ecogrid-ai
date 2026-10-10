'use client';

import React from 'react';
import {
  Zap,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';
import { EnergyHourlyReading } from '@/lib/types';

interface EnergyMonitoringCardProps {
  readings: EnergyHourlyReading[];
  onViewDetails: () => void;
}

export const EnergyMonitoringCard: React.FC<EnergyMonitoringCardProps> = ({
  readings,
  onViewDetails,
}) => {
  // Chart dimensions & point coordinates mapping
  // X ticks: 12 AM, 4 AM, 8 AM, 12 PM, 4 PM, 8 PM
  // Y range: 0 to 200 kWh
  const points = [
    { hour: '12 AM', today: 45, yest: 48, x: 25, yToday: 130, yYest: 125 },
    { hour: '4 AM', today: 38, yest: 40, x: 80, yToday: 140, yYest: 138 },
    { hour: '8 AM', today: 82, yest: 85, x: 140, yToday: 95, yYest: 90 },
    { hour: '12 PM', today: 95, yest: 92, x: 200, yToday: 80, yYest: 85 },
    { hour: '4 PM', today: 88, yest: 90, x: 260, yToday: 90, yYest: 88 },
    { hour: '8 PM', today: 110, yest: 78, x: 320, yToday: 60, yYest: 100 },
    { hour: '11 PM', today: 68, yest: 62, x: 380, yToday: 110, yYest: 115 },
  ];

  const todayPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.yToday}`).join(' ');
  const yestPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.yYest}`).join(' ');

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200/70 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Energy Monitoring</h3>
          </div>
          <button
            onClick={onViewDetails}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group"
          >
            <span>View Details</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Subtitle & Legend */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-gray-500">Electricity Consumption (kWh)</p>
          <div className="flex items-center gap-3 text-[11px] font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-emerald-500 rounded-full" />
              <span className="text-gray-700">Today</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-gray-400 rounded-full border-t border-dashed" />
              <span className="text-gray-400">Yesterday</span>
            </div>
          </div>
        </div>

        {/* Line Chart */}
        <div className="relative h-[180px] w-full">
          <svg viewBox="0 0 400 180" className="w-full h-full overflow-visible">
            {/* Horizontal Grid lines */}
            <g stroke="#f1f5f9" strokeWidth="1">
              <line x1="20" y1="20" x2="390" y2="20" />
              <line x1="20" y1="60" x2="390" y2="60" />
              <line x1="20" y1="100" x2="390" y2="100" />
              <line x1="20" y1="140" x2="390" y2="140" />
            </g>

            {/* Y Axis Labels */}
            <text x="12" y="24" fontSize="9" fill="#94a3b8" textAnchor="end">200</text>
            <text x="12" y="64" fontSize="9" fill="#94a3b8" textAnchor="end">150</text>
            <text x="12" y="104" fontSize="9" fill="#94a3b8" textAnchor="end">100</text>
            <text x="12" y="144" fontSize="9" fill="#94a3b8" textAnchor="end">50</text>
            <text x="12" y="175" fontSize="9" fill="#94a3b8" textAnchor="end">0</text>

            {/* Yesterday Line (dashed gray) */}
            <path
              d={yestPath}
              stroke="#94a3b8"
              strokeWidth="2"
              strokeDasharray="4,4"
              fill="none"
              opacity="0.8"
            />

            {/* Today Line (solid vibrant emerald green) */}
            <path
              d={todayPath}
              stroke="#10b981"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Today Points */}
            {points.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.yToday}
                r={p.hour === '8 PM' ? 4.5 : 3}
                fill={p.hour === '8 PM' ? '#ef4444' : '#10b981'}
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            ))}

            {/* X Axis Labels */}
            {points.map((p, i) => (
              <text
                key={i}
                x={p.x}
                y="170"
                fontSize="9"
                fontWeight="500"
                fill="#64748b"
                textAnchor="middle"
              >
                {p.hour}
              </text>
            ))}
          </svg>

          {/* Anomaly Detected Callout at 8 PM (Matching Screenshot exactly!) */}
          <div className="absolute top-[18px] right-[40px] bg-white border border-rose-200 shadow-md rounded-xl p-2 z-10 animate-in fade-in slide-in-from-top-1 text-center">
            <div className="flex items-center gap-1 justify-center text-[10px] font-bold text-rose-600 leading-tight">
              <span>Anomaly Detected</span>
            </div>
            <div className="text-[11px] font-bold text-gray-900 mt-0.5">
              110 kWh <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded">+42%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
