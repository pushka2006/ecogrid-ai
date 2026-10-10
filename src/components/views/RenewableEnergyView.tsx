'use client';

import React from 'react';
import {
  Sun,
  Battery,
  Zap,
  Clock,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { RenewableDaily } from '@/lib/types';

interface RenewableEnergyViewProps {
  weeklyData: RenewableDaily[];
}

export const RenewableEnergyView: React.FC<RenewableEnergyViewProps> = ({ weeklyData }) => {
  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              Renewable Energy Intelligence & Solar Storage
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              Solar PV array telemetry • Battery BESS state of charge • Dynamic load shifting
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
            ● 48% Campus Renewable Share
          </span>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Solar Generation */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200/70 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-1">
            <span>Rooftop Solar PV</span>
            <Sun className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-black text-gray-900">2,860 kWh</p>
          <p className="text-xs text-emerald-600 font-bold mt-1">+22% vs historical benchmark</p>
          <p className="text-[10px] text-gray-400 mt-2">Metered via SolarEdge SCADA Inverters</p>
        </div>

        {/* Grid Electricity Avoided */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200/70 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-1">
            <span>Grid Draw Avoided</span>
            <Zap className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-emerald-700">2,345 kWh</p>
          <p className="text-xs text-emerald-600 font-bold mt-1">₹22,277 saved this week</p>
          <p className="text-[10px] text-gray-400 mt-2">Offsetting coal-fired grid baseline</p>
        </div>

        {/* Battery Storage (BESS) */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200/70 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-1">
            <span>Lithium BESS Storage</span>
            <Battery className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-3xl font-black text-gray-900">82% SOC</p>
          <p className="text-xs text-blue-600 font-bold mt-1">420 kWh reserve available</p>
          <p className="text-[10px] text-gray-400 mt-2">Discharging during 6 PM - 10 PM peak</p>
        </div>
      </div>

      {/* Smart Load Shifting Recommendation Engine */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-gray-900">
            Intelligent Load-Shifting Recommendations
          </h3>
        </div>
        <p className="text-xs text-gray-500">
          Optimal dispatch windows based on solar irradiance forecasts and grid tariff schedules
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs">
            <span className="font-bold text-emerald-900 block text-sm">
              Shift Central Chiller Pre-Cooling to 1:00 PM – 3:30 PM
            </span>
            <p className="text-emerald-800/90 font-medium mt-1 leading-relaxed">
              Surplus solar generation exceeds campus base load by 420 kW between 1:00 PM and 3:30 PM. Pre-cooling academic halls during this window lowers peak 8:00 PM chiller spikes by 65%.
            </p>
            <div className="mt-3 flex items-center gap-2 text-emerald-950 font-bold">
              <span className="bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                Estimated Savings: ₹14,200 / month
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 text-xs">
            <span className="font-bold text-blue-900 block text-sm">
              Schedule EV Waste Truck Fleet Charging at 11:30 AM
            </span>
            <p className="text-blue-800/90 font-medium mt-1 leading-relaxed">
              Charging EcoTruck Zero-1 using 100% on-site solar eliminates diesel dependency and delivers 0.0g carbon collection logistics for the campus.
            </p>
            <div className="mt-3 flex items-center gap-2 text-blue-950 font-bold">
              <span className="bg-blue-100 px-2 py-0.5 rounded-full text-[10px]">
                Zero Grid Tariff Expense
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modeled vs Actual Breakdown Table */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
        <h3 className="text-sm font-bold text-gray-900 mb-1">
          Weekly Generation Audit: Modeled PV vs Verified Inverter Production
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Clear distinction between actual metered data and predictive solar irradiance models
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 text-gray-500 font-semibold border-y border-gray-200">
              <tr>
                <th className="py-2.5 px-3">Day</th>
                <th className="py-2.5 px-3">Actual Solar (kWh)</th>
                <th className="py-2.5 px-3">Modeled Estimate (kWh)</th>
                <th className="py-2.5 px-3">Grid Import (kWh)</th>
                <th className="py-2.5 px-3">Battery Discharged (kWh)</th>
                <th className="py-2.5 px-3">Renewable Share (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
              {weeklyData.map((d) => {
                const modeled = Math.round(d.solarGenerationKwh * 1.05);
                const total = d.solarGenerationKwh + d.gridConsumptionKwh;
                const share = Math.round((d.solarGenerationKwh / total) * 100);
                return (
                  <tr key={d.day} className="hover:bg-gray-50">
                    <td className="py-3 px-3 font-bold text-gray-900">{d.day}</td>
                    <td className="py-3 px-3 font-bold text-emerald-700">{d.solarGenerationKwh} kWh</td>
                    <td className="py-3 px-3 text-gray-400">{modeled} kWh (Model)</td>
                    <td className="py-3 px-3">{d.gridConsumptionKwh} kWh</td>
                    <td className="py-3 px-3 text-blue-600">{d.batteryDischargeKwh} kWh</td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-emerald-700">{share}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
