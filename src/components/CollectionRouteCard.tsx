'use client';

import React from 'react';
import {
  Truck,
  ArrowRight,
  TrendingDown,
  Clock,
  Sparkles,
} from 'lucide-react';
import { CollectionRoute } from '@/lib/types';

interface CollectionRouteCardProps {
  route: CollectionRoute;
  onViewRoute: () => void;
  onReoptimize?: () => void;
}

export const CollectionRouteCard: React.FC<CollectionRouteCardProps> = ({
  route,
  onViewRoute,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200/70 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Truck className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Collection Route</h3>
          </div>
          <button
            onClick={onViewRoute}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group"
          >
            <span>View Route</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Route Visual Map Graphic */}
        <div className="relative rounded-2xl overflow-hidden border border-gray-200/80 bg-[#edf5ed] h-[160px] select-none shadow-inner">
          <svg viewBox="0 0 400 200" className="w-full h-full object-cover">
            {/* Campus Background Roads */}
            <path
              d="M 20,40 L 380,40 M 20,160 L 380,160 M 120,0 L 120,200 M 280,0 L 280,200"
              stroke="#ffffff"
              strokeWidth="16"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 20,40 L 380,40 M 20,160 L 380,160 M 120,0 L 120,200 M 280,0 L 280,200"
              stroke="#e2e8f0"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
            />

            {/* Baseline comparison path (dashed light gray) */}
            <path
              d="M 80,130 L 140,50 L 310,50 L 290,140 L 190,170 Z"
              stroke="#94a3b8"
              strokeWidth="2"
              strokeDasharray="4,4"
              fill="none"
              opacity="0.5"
            />

            {/* Optimized Route Path (Vibrant Blue Loop) */}
            <path
              d="M 90,120 L 130,60 L 270,55 L 320,125 L 200,160 Z"
              stroke="#2563eb"
              strokeWidth="3.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              fill="none"
            />

            {/* Stops numbered 1 to 5 */}
            {/* Stop 1 */}
            <g transform="translate(130, 60)">
              <circle cx="0" cy="0" r="10" fill="#059669" stroke="#ffffff" strokeWidth="2" />
              <text x="0" y="3.5" fontSize="9" fontWeight="bold" fill="#ffffff" textAnchor="middle">1</text>
            </g>

            {/* Stop 2 */}
            <g transform="translate(90, 120)">
              <circle cx="0" cy="0" r="10" fill="#059669" stroke="#ffffff" strokeWidth="2" />
              <text x="0" y="3.5" fontSize="9" fontWeight="bold" fill="#ffffff" textAnchor="middle">2</text>
            </g>

            {/* Stop 3 */}
            <g transform="translate(200, 160)">
              <circle cx="0" cy="0" r="10" fill="#059669" stroke="#ffffff" strokeWidth="2" />
              <text x="0" y="3.5" fontSize="9" fontWeight="bold" fill="#ffffff" textAnchor="middle">3</text>
            </g>

            {/* Stop 4 */}
            <g transform="translate(320, 125)">
              <circle cx="0" cy="0" r="10" fill="#059669" stroke="#ffffff" strokeWidth="2" />
              <text x="0" y="3.5" fontSize="9" fontWeight="bold" fill="#ffffff" textAnchor="middle">4</text>
            </g>

            {/* Stop 5 */}
            <g transform="translate(270, 55)">
              <circle cx="0" cy="0" r="10" fill="#059669" stroke="#ffffff" strokeWidth="2" />
              <text x="0" y="3.5" fontSize="9" fontWeight="bold" fill="#ffffff" textAnchor="middle">5</text>
            </g>

            {/* Garbage Truck Icon along route */}
            <g transform="translate(200, 60)">
              <rect x="-14" y="-8" width="28" height="16" rx="4" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="-7" cy="8" r="3" fill="#1f2937" />
              <circle cx="7" cy="8" r="3" fill="#1f2937" />
              <text x="0" y="3" fontSize="8" fontWeight="bold" fill="#ffffff" textAnchor="middle">EV</text>
            </g>
          </svg>
        </div>

        {/* Route Comparison Stats (Exact layout from screenshot) */}
        <div className="grid grid-cols-2 gap-4 mt-4 pt-1">
          {/* Left: Optimized Route */}
          <div>
            <p className="text-[11px] font-semibold text-gray-500">Optimized Route</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-black text-gray-900 tracking-tight">
                {route.optimizedDistanceKm} km
              </span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full flex items-center">
                <TrendingDown className="w-2.5 h-2.5 mr-0.5" />
                28% vs. baseline
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium mt-1">
              Est. time: {route.optimizedTimeMin} min
            </p>
          </div>

          {/* Right: Baseline Route */}
          <div>
            <p className="text-[11px] font-semibold text-gray-500">Baseline Route</p>
            <div className="mt-0.5">
              <span className="text-xl font-bold text-gray-700 tracking-tight">
                {route.baselineDistanceKm} km
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium mt-1">
              Est. time: 1 hr 12 min
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
