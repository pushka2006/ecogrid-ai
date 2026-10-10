'use client';

import React, { useState } from 'react';
import {
  Trash2,
  ArrowRight,
  Plus,
  Minus,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  BatteryCharging,
  Thermometer,
  Layers,
} from 'lucide-react';
import { SmartBin } from '@/lib/types';

interface BinMonitoringCardProps {
  bins: SmartBin[];
  selectedBinId: string;
  onSelectBin: (id: string) => void;
  onViewAllBins: () => void;
}

export const BinMonitoringCard: React.FC<BinMonitoringCardProps> = ({
  bins,
  selectedBinId,
  onSelectBin,
  onViewAllBins,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const selectedBin = bins.find(b => b.id === selectedBinId) || bins[0];

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200/70 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Trash2 className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Bin Monitoring</h3>
          </div>
          <button
            onClick={onViewAllBins}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Interactive Map Canvas Container */}
        <div className="relative rounded-2xl overflow-hidden border border-gray-200/80 bg-[#eef5ee] h-[260px] select-none shadow-inner">
          {/* Zoom controls on top-left */}
          <div className="absolute top-3 left-3 z-20 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <button
              onClick={() => setZoomLevel(Math.min(zoomLevel + 0.15, 1.4))}
              className="p-1.5 hover:bg-gray-100 text-gray-600 border-b border-gray-200"
              title="Zoom in"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(Math.max(zoomLevel - 0.15, 0.85))}
              className="p-1.5 hover:bg-gray-100 text-gray-600"
              title="Zoom out"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Map Legend floating on top-right */}
          <div className="absolute top-2.5 right-2.5 z-20 bg-white/90 backdrop-blur-xs rounded-xl p-2 shadow-xs border border-gray-200/80 text-[10px] space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-gray-600 font-medium">Normal (0–70%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-gray-600 font-medium">Warning (71–90%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="text-gray-600 font-medium">Full (91–100%)</span>
            </div>
            <div className="flex items-center gap-1.5 pt-0.5 border-t border-gray-100">
              <span className="w-3 h-0.5 border-t-2 border-dashed border-blue-500" />
              <span className="text-gray-500">Collection Route</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600 ring-2 ring-blue-300" />
              <span className="text-gray-500">Current Location</span>
            </div>
          </div>

          {/* SVG Map Graphic */}
          <svg
            viewBox="0 0 700 500"
            className="w-full h-full object-cover transition-transform duration-300"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <defs>
              {/* Pattern for campus park foliage */}
              <pattern id="campus-park" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect width="20" height="20" fill="#e4f1e4" />
                <circle cx="10" cy="10" r="1.5" fill="#cbe4cb" />
              </pattern>
            </defs>

            {/* Campus Ground Background */}
            <rect width="700" height="500" fill="url(#campus-park)" />

            {/* Water Canal / Lake in Campus */}
            <path
              d="M 0,220 C 140,230 180,180 300,260 C 420,340 480,240 700,280 L 700,320 C 480,280 420,380 300,300 C 180,220 140,270 0,260 Z"
              fill="#bfdbfe"
              opacity="0.75"
            />

            {/* Campus Roads & Pathways */}
            <path
              d="M 50,0 L 50,500 M 650,0 L 650,500 M 0,120 L 700,120 M 0,380 L 700,380 M 350,0 L 350,500 M 150,0 C 220,180 200,320 280,500 M 520,0 C 480,180 500,340 560,500"
              stroke="#ffffff"
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M 50,0 L 50,500 M 650,0 L 650,500 M 0,120 L 700,120 M 0,380 L 700,380 M 350,0 L 350,500 M 150,0 C 220,180 200,320 280,500 M 520,0 C 480,180 500,340 560,500"
              stroke="#e2e8f0"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />

            {/* Building Blocks */}
            <rect x="80" y="40" width="120" height="60" rx="8" fill="#d1fae5" stroke="#a7f3d0" strokeWidth="2" />
            <text x="140" y="75" fontSize="11" fontWeight="bold" fill="#065f46" textAnchor="middle">Science Hub</text>

            <rect x="250" y="30" width="160" height="70" rx="8" fill="#d1fae5" stroke="#a7f3d0" strokeWidth="2" />
            <text x="330" y="70" fontSize="11" fontWeight="bold" fill="#065f46" textAnchor="middle">North Block</text>

            <rect x="470" y="40" width="150" height="60" rx="8" fill="#d1fae5" stroke="#a7f3d0" strokeWidth="2" />
            <text x="545" y="75" fontSize="11" fontWeight="bold" fill="#065f46" textAnchor="middle">Sports Complex</text>

            <rect x="80" y="390" width="130" height="70" rx="8" fill="#d1fae5" stroke="#a7f3d0" strokeWidth="2" />
            <text x="145" y="430" fontSize="11" fontWeight="bold" fill="#065f46" textAnchor="middle">Hostels A & B</text>

            <rect x="260" y="390" width="180" height="80" rx="8" fill="#d1fae5" stroke="#a7f3d0" strokeWidth="2" />
            <text x="350" y="435" fontSize="11" fontWeight="bold" fill="#065f46" textAnchor="middle">Central Library</text>

            <rect x="490" y="390" width="140" height="70" rx="8" fill="#d1fae5" stroke="#a7f3d0" strokeWidth="2" />
            <text x="560" y="430" fontSize="11" fontWeight="bold" fill="#065f46" textAnchor="middle">South Gate Terminal</text>

            {/* Central Quad Lawn */}
            <circle cx="350" cy="250" r="45" fill="#a7f3d0" stroke="#6ee7b7" strokeWidth="2" />
            <text x="350" y="254" fontSize="10" fontWeight="bold" fill="#047857" textAnchor="middle">Central Quad</text>

            {/* Route path line between key bins */}
            <path
              d="M 440,220 L 380,310 L 260,410 L 620,480"
              stroke="#3b82f6"
              strokeWidth="3.5"
              strokeDasharray="6,4"
              strokeLinecap="round"
              fill="none"
              opacity="0.8"
            />

            {/* Current Depot Location Marker */}
            <circle cx="350" cy="300" r="7" fill="#2563eb" stroke="#ffffff" strokeWidth="2.5" />
            <circle cx="350" cy="300" r="14" fill="#3b82f6" opacity="0.25" className="animate-ping" />

            {/* Plot Smart Bin Pins */}
            {bins.map((bin) => {
              const isSelected = bin.id === selectedBinId;
              const pinColor =
                bin.fillLevel >= 90
                  ? '#ef4444' // red
                  : bin.fillLevel >= 71
                  ? '#f59e0b' // amber
                  : '#10b981'; // green

              return (
                <g
                  key={bin.id}
                  transform={`translate(${bin.coords.x}, ${bin.coords.y})`}
                  onClick={() => onSelectBin(bin.id)}
                  className="cursor-pointer group"
                >
                  {/* Glowing ring if selected or full */}
                  {isSelected && (
                    <circle cx="0" cy="0" r="18" fill={pinColor} opacity="0.3" className="animate-pulse" />
                  )}
                  {/* Outer circle */}
                  <circle
                    cx="0"
                    cy="0"
                    r={isSelected ? 12 : 9}
                    fill={pinColor}
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    className="transition-transform group-hover:scale-125"
                  />
                  {/* Inner text or dot */}
                  <text
                    x="0"
                    y="3"
                    fontSize={isSelected ? "9" : "7"}
                    fontWeight="bold"
                    fill="#ffffff"
                    textAnchor="middle"
                  >
                    {bin.id.replace('B-', '')}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Selected Bin Popup Card (Matching Screenshot exactly!) */}
          {selectedBin && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 bg-white rounded-xl px-4 py-2.5 shadow-lg border border-gray-200/90 flex flex-col items-center min-w-[210px] animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-xs font-bold text-gray-900">{selectedBin.label}</span>
                <span className="text-[10px] text-gray-400">•</span>
                <span className="text-[11px] text-gray-600 font-medium">{selectedBin.wasteType}</span>
              </div>
              <div className="flex items-center gap-2 my-1">
                <span className="text-xs font-semibold text-gray-700">
                  Fill level: <strong className="text-gray-900">{selectedBin.fillLevel}%</strong>
                </span>
                {selectedBin.fillLevel >= 85 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    Needs Collection
                  </span>
                )}
              </div>
              <button
                onClick={onViewAllBins}
                className="w-full mt-1.5 py-1 px-3 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
              >
                View Details
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
