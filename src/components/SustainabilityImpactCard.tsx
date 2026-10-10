'use client';

import React from 'react';
import {
  Leaf,
  ArrowRight,
  TrendingUp,
  Zap,
  Trees,
} from 'lucide-react';

interface SustainabilityImpactCardProps {
  onViewReport: () => void;
  wasteDivertedKg?: number;
  co2Tons?: number;
  costSavingsINR?: number;
  energySavedKwh?: number;
}

export const SustainabilityImpactCard: React.FC<SustainabilityImpactCardProps> = ({
  onViewReport,
  wasteDivertedKg = 1890,
  co2Tons = 4.8,
  costSavingsINR = 28450,
  energySavedKwh = 4320,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200/70 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Leaf className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Sustainability Impact</h3>
          </div>
          <button
            onClick={onViewReport}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group"
          >
            <span>View Report</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 2x2 Grid of Impact Metric Tiles */}
        <div className="grid grid-cols-2 gap-3">
          {/* 1. Waste Diverted from Landfill */}
          <div className="p-3.5 rounded-xl bg-gray-50/60 border border-gray-200/60 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Trees className="w-3.5 h-3.5" />
              </div>
              <p className="text-[11px] font-semibold text-gray-500 leading-tight">
                Waste Diverted from Landfill
              </p>
            </div>
            <div>
              <p className="text-lg font-black text-gray-900 tracking-tight">
                {wasteDivertedKg.toLocaleString()} <span className="text-xs font-bold text-gray-500">kg</span>
              </p>
              <p className="text-[10px] font-bold text-emerald-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-0.5" />
                14%
              </p>
            </div>
          </div>

          {/* 2. CO2 Emissions Avoided */}
          <div className="p-3.5 rounded-xl bg-gray-50/60 border border-gray-200/60 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Leaf className="w-3.5 h-3.5" />
              </div>
              <p className="text-[11px] font-semibold text-gray-500 leading-tight">
                CO₂ Emissions Avoided
              </p>
            </div>
            <div>
              <p className="text-lg font-black text-gray-900 tracking-tight">
                {co2Tons} <span className="text-xs font-bold text-gray-500">tons</span>
              </p>
              <p className="text-[10px] font-bold text-emerald-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-0.5" />
                15%
              </p>
            </div>
          </div>

          {/* 3. Estimated Cost Savings */}
          <div className="p-3.5 rounded-xl bg-gray-50/60 border border-gray-200/60 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                ₹
              </div>
              <p className="text-[11px] font-semibold text-gray-500 leading-tight">
                Estimated Cost Savings
              </p>
            </div>
            <div>
              <p className="text-lg font-black text-gray-900 tracking-tight">
                ₹ {costSavingsINR.toLocaleString()}
              </p>
              <p className="text-[10px] font-bold text-emerald-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-0.5" />
                12%
              </p>
            </div>
          </div>

          {/* 4. Energy Saved */}
          <div className="p-3.5 rounded-xl bg-gray-50/60 border border-gray-200/60 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <p className="text-[11px] font-semibold text-gray-500 leading-tight">
                Energy Saved
              </p>
            </div>
            <div>
              <p className="text-lg font-black text-gray-900 tracking-tight">
                {energySavedKwh.toLocaleString()} <span className="text-xs font-bold text-gray-500">kWh</span>
              </p>
              <p className="text-[10px] font-bold text-emerald-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-0.5" />
                18%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
