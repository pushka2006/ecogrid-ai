'use client';

import React from 'react';
import {
  Trash2,
  Recycle,
  Zap,
  Sun,
  Leaf,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

interface KpiRowProps {
  totalWasteKg?: number;
  recyclableKg?: number;
  totalKwh?: number;
  solarKwh?: number;
  co2Tons?: number;
}

export const KpiRow: React.FC<KpiRowProps> = ({
  totalWasteKg = 2450,
  recyclableKg = 1320,
  totalKwh = 8650,
  solarKwh = 2860,
  co2Tons = 4.8,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {/* 1. Total Waste Collected */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200/70 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-500">Total Waste Collected</span>
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Trash2 className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-black text-gray-900 tracking-tight">
            {totalWasteKg.toLocaleString()} <span className="text-sm font-bold text-gray-500">kg</span>
          </span>
          <div className="flex items-center text-xs font-bold text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            <span>12%</span>
          </div>
        </div>
        <div className="text-[10px] text-gray-400 font-medium text-right mt-0.5">
          vs last week
        </div>
        <div className="mt-3">
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '68%' }} />
          </div>
          <p className="text-[11px] font-semibold text-gray-500 mt-1.5">
            68% recyclable
          </p>
        </div>
      </div>

      {/* 2. Recyclable Material Recovered */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200/70 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-500">Recyclable Material Recovered</span>
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Recycle className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-black text-gray-900 tracking-tight">
            {recyclableKg.toLocaleString()} <span className="text-sm font-bold text-gray-500">kg</span>
          </span>
          <div className="flex items-center text-xs font-bold text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            <span>18%</span>
          </div>
        </div>
        <div className="text-[10px] text-gray-400 font-medium text-right mt-0.5">
          vs last week
        </div>
        <div className="mt-3">
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '54%' }} />
          </div>
          <p className="text-[11px] font-semibold text-gray-500 mt-1.5">
            54% of total waste
          </p>
        </div>
      </div>

      {/* 3. Total Energy Consumption */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200/70 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-500">Total Energy Consumption</span>
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-black text-gray-900 tracking-tight">
            {totalKwh.toLocaleString()} <span className="text-sm font-bold text-gray-500">kWh</span>
          </span>
          <div className="flex items-center text-xs font-bold text-emerald-600">
            <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
            <span>6%</span>
          </div>
        </div>
        <div className="text-[10px] text-gray-400 font-medium text-right mt-0.5">
          vs last week
        </div>
        <div className="mt-3">
          <div className="h-1.5" />
          <p className="text-[11px] font-semibold text-gray-600 mt-1.5 flex items-center gap-1">
            <span>Estimated cost:</span>
            <span className="font-bold text-gray-900">₹65,420</span>
          </p>
        </div>
      </div>

      {/* 4. Solar Energy Generated */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200/70 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-500">Solar Energy Generated</span>
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
            <Sun className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-black text-gray-900 tracking-tight">
            {solarKwh.toLocaleString()} <span className="text-sm font-bold text-gray-500">kWh</span>
          </span>
          <div className="flex items-center text-xs font-bold text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            <span>22%</span>
          </div>
        </div>
        <div className="text-[10px] text-gray-400 font-medium text-right mt-0.5">
          vs last week
        </div>
        <div className="mt-3">
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '33%' }} />
          </div>
          <p className="text-[11px] font-semibold text-gray-500 mt-1.5">
            33% of total demand
          </p>
        </div>
      </div>

      {/* 5. CO2 Emissions Avoided */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200/70 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-500">CO₂ Emissions Avoided</span>
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Leaf className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-black text-gray-900 tracking-tight">
            {co2Tons} <span className="text-sm font-bold text-gray-500">tons</span>
          </span>
          <div className="flex items-center text-xs font-bold text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            <span>15%</span>
          </div>
        </div>
        <div className="text-[10px] text-gray-400 font-medium text-right mt-0.5">
          vs last week
        </div>
        <div className="mt-3">
          <div className="h-1.5" />
          <p className="text-[11px] font-semibold text-gray-600 mt-1.5">
            Equivalent to <span className="font-bold text-gray-900">1,036 trees</span>
          </p>
        </div>
      </div>
    </div>
  );
};
