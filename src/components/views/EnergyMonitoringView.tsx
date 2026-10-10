'use client';

import React, { useState } from 'react';
import {
  Zap,
  Upload,
  AlertTriangle,
  TrendingDown,
  Building,
  DollarSign,
  FileSpreadsheet,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { EnergyHourlyReading, BuildingEnergy } from '@/lib/types';
import { parseEnergyCsv, DEFAULT_TARIFFS } from '@/lib/energyAnomalyEngine';

interface EnergyMonitoringViewProps {
  hourlyReadings: EnergyHourlyReading[];
  buildings: BuildingEnergy[];
  onImportCsvReadings: (readings: EnergyHourlyReading[]) => void;
}

export const EnergyMonitoringView: React.FC<EnergyMonitoringViewProps> = ({
  hourlyReadings,
  buildings,
  onImportCsvReadings,
}) => {
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>('BLD-B');
  const [csvUploadSuccess, setCsvUploadSuccess] = useState(false);
  const [anomalyThreshold, setAnomalyThreshold] = useState(25);

  const selectedBuilding = buildings.find(b => b.id === selectedBuildingId) || buildings[1];

  const handleCsvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const parsed = parseEnergyCsv(text);
      if (parsed.length > 0) {
        onImportCsvReadings(parsed);
        setCsvUploadSuccess(true);
        setTimeout(() => setCsvUploadSuccess(false), 4000);
      }
    };
    reader.readAsText(file);
  };

  const handleLoadSampleCsv = () => {
    const sampleCsv = `Hour,TodayKwh,YesterdayKwh
12 AM,42,46
2 AM,39,41
4 AM,35,38
6 AM,55,54
8 AM,88,82
10 AM,99,95
12 PM,102,96
2 PM,94,92
4 PM,89,88
6 PM,96,89
8 PM,115,74
10 PM,72,61`;
    const parsed = parseEnergyCsv(sampleCsv);
    onImportCsvReadings(parsed);
    setCsvUploadSuccess(true);
    setTimeout(() => setCsvUploadSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              Electricity Monitoring & Anomaly Diagnostics
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              Sub-metered telemetry • 3-sigma anomaly detector • Building efficiency benchmarking
            </p>
          </div>
        </div>

        {/* CSV Import buttons */}
        <div className="flex items-center gap-2">
          <label className="cursor-pointer px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5" />
            <span>Import CSV Meter Data</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleCsvFileUpload}
              className="hidden"
            />
          </label>
          <button
            onClick={handleLoadSampleCsv}
            className="px-3 py-2.5 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
          >
            Load Sample CSV
          </button>
        </div>
      </div>

      {csvUploadSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Smart-meter CSV parsed successfully! 12 hourly readings and anomalies re-calculated.</span>
        </div>
      )}

      {/* Buildings Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {buildings.map((bld) => {
          const isSelected = bld.id === selectedBuildingId;
          return (
            <div
              key={bld.id}
              onClick={() => setSelectedBuildingId(bld.id)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-emerald-50/40 border-emerald-500 ring-1 ring-emerald-500'
                  : 'bg-white border-gray-200/80 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-900 truncate">{bld.name.split('(')[0]}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    bld.status === 'High Waste'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : bld.status === 'Warning'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {bld.status}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-gray-900">{bld.currentKwh}</span>
                <span className="text-xs text-gray-400">kWh</span>
                <span
                  className={`text-xs font-bold ml-auto ${
                    bld.deviationPercent > 0 ? 'text-rose-600' : 'text-emerald-600'
                  }`}
                >
                  {bld.deviationPercent > 0 ? `+${bld.deviationPercent}%` : `${bld.deviationPercent}%`}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium mt-2">
                Potential Savings: <strong className="text-gray-900">₹{bld.potentialSavingsINR.toLocaleString()}</strong>
              </p>
            </div>
          );
        })}
      </div>

      {/* Anomaly Deep Dive for Selected Building */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Diagnostic Focus
            </span>
            <h3 className="text-lg font-bold text-gray-900 mt-0.5">{selectedBuilding.name}</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-500">
              Floor Area: {selectedBuilding.areaSqM.toLocaleString()} m²
            </span>
            <span className="text-xs font-bold text-gray-800 bg-gray-100 px-3 py-1.5 rounded-xl">
              Energy Intensity: {(selectedBuilding.currentKwh / selectedBuilding.areaSqM).toFixed(2)} kWh/m²
            </span>
          </div>
        </div>

        {/* Actionable Anomaly Alert */}
        {selectedBuilding.status === 'High Waste' && (
          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-xs font-bold text-rose-950">
                Critical Energy Spike: +42% Overnight Anomaly at 8:00 PM
              </h4>
              <p className="text-xs text-rose-900/90 font-medium mt-1 leading-relaxed">
                {selectedBuilding.recommendation}
              </p>
              <div className="mt-3 flex items-center gap-4 text-xs">
                <span className="font-semibold text-rose-950">
                  Peak Tariff Rate: <strong>₹{DEFAULT_TARIFFS.peakRateINR}/kWh</strong>
                </span>
                <span className="font-semibold text-rose-950">
                  Projected Monthly Cost Waste: <strong>₹{selectedBuilding.potentialSavingsINR.toLocaleString()}</strong>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Hourly Table */}
        <div>
          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
            Hourly Telemetry Readings & Threshold Analysis
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 text-gray-500 font-semibold border-y border-gray-200">
                <tr>
                  <th className="py-2.5 px-3">Hour</th>
                  <th className="py-2.5 px-3">Today Demand (kWh)</th>
                  <th className="py-2.5 px-3">Baseline Demand (kWh)</th>
                  <th className="py-2.5 px-3">Variance (%)</th>
                  <th className="py-2.5 px-3">Detection Status</th>
                  <th className="py-2.5 px-3">Tariff Window</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {hourlyReadings.map((r) => {
                  const variance = Math.round(((r.todayKwh - r.yesterdayKwh) / r.yesterdayKwh) * 100);
                  const isPeak = r.hour === '8 PM' || r.hour === '6 PM' || r.hour === '10 PM';
                  return (
                    <tr key={r.hour} className={r.isAnomaly ? 'bg-rose-50/50 font-semibold' : 'hover:bg-gray-50'}>
                      <td className="py-2.5 px-3 font-bold text-gray-900">{r.hour}</td>
                      <td className="py-2.5 px-3">{r.todayKwh} kWh</td>
                      <td className="py-2.5 px-3 text-gray-500">{r.yesterdayKwh} kWh</td>
                      <td className="py-2.5 px-3">
                        <span className={variance > 20 ? 'text-rose-600 font-bold' : 'text-gray-700'}>
                          {variance > 0 ? `+${variance}%` : `${variance}%`}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        {r.isAnomaly ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                            Anomaly Flagged
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-700 font-semibold">Normal</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] text-gray-500">
                          {isPeak ? 'Peak (₹9.50)' : 'Standard (₹6.50)'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
