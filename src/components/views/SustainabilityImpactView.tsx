'use client';

import React from 'react';
import {
  Leaf,
  ShieldCheck,
  CheckCircle2,
  Trees,
  Zap,
  DollarSign,
  TrendingUp,
  FileCheck,
  Info,
} from 'lucide-react';

interface SustainabilityImpactViewProps {
  totalWasteKg: number;
  recyclableKg: number;
  wasteDivertedKg: number;
  solarKwh: number;
  co2Tons: number;
  costSavingsINR: number;
}

export const SustainabilityImpactView: React.FC<SustainabilityImpactViewProps> = ({
  totalWasteKg,
  recyclableKg,
  wasteDivertedKg,
  solarKwh,
  co2Tons,
  costSavingsINR,
}) => {
  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              Verified ESG Sustainability Impact Dashboard
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              Transparent GHG protocol carbon accounting, landfill diversion, and circularity proof
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>ISO 14064 GHG Compliant</span>
          </span>
        </div>
      </div>

      {/* 4 Impact Big Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-gray-200/70 shadow-xs">
          <span className="text-xs font-semibold text-gray-500">Verified Landfill Diversion</span>
          <p className="text-3xl font-black text-gray-900 mt-1">
            {wasteDivertedKg.toLocaleString()} <span className="text-xs font-bold text-gray-500">kg</span>
          </p>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-2">
            77.1% Diversion Rate
          </span>
          <p className="text-[10px] text-gray-400 mt-2">Recycled + aerobically composted</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200/70 shadow-xs">
          <span className="text-xs font-semibold text-gray-500">GHG Emissions Abated</span>
          <p className="text-3xl font-black text-emerald-700 mt-1">
            {co2Tons} <span className="text-xs font-bold text-emerald-600">tCO₂e</span>
          </p>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-2">
            1,036 Trees Equivalent
          </span>
          <p className="text-[10px] text-gray-400 mt-2">Scope 1 & Scope 2 reductions</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200/70 shadow-xs">
          <span className="text-xs font-semibold text-gray-500">Documented Cost Savings</span>
          <p className="text-3xl font-black text-gray-900 mt-1">
            ₹{costSavingsINR.toLocaleString()}
          </p>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-2">
            Tariff & Landfill Tipping Fees
          </span>
          <p className="text-[10px] text-gray-400 mt-2">Validated against municipal bills</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-200/70 shadow-xs">
          <span className="text-xs font-semibold text-gray-500">Solar Energy Deployed</span>
          <p className="text-3xl font-black text-amber-500 mt-1">
            {solarKwh.toLocaleString()} <span className="text-xs font-bold text-gray-500">kWh</span>
          </p>
          <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full inline-block mt-2">
            33% Total Campus Demand
          </span>
          <p className="text-[10px] text-gray-400 mt-2">Zero-emission generation</p>
        </div>
      </div>

      {/* Transparent Conversion Factors Documentation */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-gray-900">
            Documented GHG Emission & Conversion Factors
          </h3>
        </div>
        <p className="text-xs text-gray-500">
          Published emission baselines strictly enforced to prevent double-counting or exaggerated claims:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs">
            <span className="font-bold text-gray-900 block mb-1">
              Electricity Grid Carbon Factor
            </span>
            <span className="text-emerald-700 font-extrabold text-base">0.82 kg CO₂e / kWh</span>
            <p className="text-gray-500 mt-1 text-[11px]">
              Source: Central Electricity Authority (CEA) Baseline Database for Indian Power Grid v19.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs">
            <span className="font-bold text-gray-900 block mb-1">
              Polymer Recycling Displacement
            </span>
            <span className="text-emerald-700 font-extrabold text-base">1.50 kg CO₂e / kg PET</span>
            <p className="text-gray-500 mt-1 text-[11px]">
              Source: EPA WARM (Waste Reduction Model) virgin polymer displacement factor.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs">
            <span className="font-bold text-gray-900 block mb-1">
              Mature Tree Carbon Sequestration
            </span>
            <span className="text-emerald-700 font-extrabold text-base">21.77 kg CO₂ / tree / yr</span>
            <p className="text-gray-500 mt-1 text-[11px]">
              Source: United Nations Food and Agriculture Organization (FAO) forest carbon metric.
            </p>
          </div>
        </div>
      </div>

      {/* Site Comparison Table */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
        <h3 className="text-sm font-bold text-gray-900 mb-1">Campus Site Performance Matrix</h3>
        <p className="text-xs text-gray-500 mb-4">
          Audited waste segregation efficiency, energy variance, and verified diversion by precinct
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 text-gray-500 font-semibold border-y border-gray-200">
              <tr>
                <th className="py-2.5 px-3">Campus Precinct</th>
                <th className="py-2.5 px-3">Waste Generated</th>
                <th className="py-2.5 px-3">Recyclables Recovered</th>
                <th className="py-2.5 px-3">Landfill Diversion Rate</th>
                <th className="py-2.5 px-3">Electricity Consumed</th>
                <th className="py-2.5 px-3">Audit Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-3 font-bold text-gray-900">Academic & Science Quad</td>
                <td className="py-3 px-3">820 kg</td>
                <td className="py-3 px-3 font-bold text-emerald-700">590 kg</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800">
                    71.9%
                  </span>
                </td>
                <td className="py-3 px-3">3,550 kWh</td>
                <td className="py-3 px-3 text-emerald-600 font-bold">Verified ✓</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-3 font-bold text-gray-900">Hostel & Dining Complex</td>
                <td className="py-3 px-3">1,120 kg</td>
                <td className="py-3 px-3 font-bold text-emerald-700">920 kg</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800">
                    82.1%
                  </span>
                </td>
                <td className="py-3 px-3">1,980 kWh</td>
                <td className="py-3 px-3 text-emerald-600 font-bold">Verified ✓</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-3 font-bold text-gray-900">Admin & Library Quad</td>
                <td className="py-3 px-3">510 kg</td>
                <td className="py-3 px-3 font-bold text-emerald-700">380 kg</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800">
                    74.5%
                  </span>
                </td>
                <td className="py-3 px-3">3,120 kWh</td>
                <td className="py-3 px-3 text-emerald-600 font-bold">Verified ✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
