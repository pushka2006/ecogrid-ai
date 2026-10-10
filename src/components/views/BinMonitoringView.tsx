'use client';

import React, { useState } from 'react';
import {
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  BatteryCharging,
  Thermometer,
  Radio,
  Plus,
  RefreshCw,
  Bell,
} from 'lucide-react';
import { SmartBin } from '@/lib/types';

interface BinMonitoringViewProps {
  bins: SmartBin[];
  onUpdateBin: (updatedBin: SmartBin) => void;
  onRequestCollection: (binId: string) => void;
}

export const BinMonitoringView: React.FC<BinMonitoringViewProps> = ({
  bins,
  onUpdateBin,
  onRequestCollection,
}) => {
  const [selectedBinId, setSelectedBinId] = useState<string>(bins[0]?.id || 'B-12');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [isSimulatingIot, setIsSimulatingIot] = useState(false);

  const selectedBin = bins.find(b => b.id === selectedBinId) || bins[0];

  const handleFillSliderChange = (newFill: number) => {
    if (!selectedBin) return;
    const updated: SmartBin = {
      ...selectedBin,
      fillLevel: newFill,
      status: newFill >= 90 ? 'Full' : newFill >= 71 ? 'Warning' : 'Normal',
      urgentNeedsCollection: newFill >= 85,
      lastPing: 'Just now (Simulated IoT)',
      estimatedWeightKg: Number(((newFill / 100) * 55).toFixed(1)),
    };
    onUpdateBin(updated);
  };

  const handleSimulateIotSpike = () => {
    setIsSimulatingIot(true);
    setTimeout(() => {
      if (selectedBin) {
        const newFill = Math.min(100, selectedBin.fillLevel + 25);
        handleFillSliderChange(newFill);
      }
      setIsSimulatingIot(false);
    }, 400);
  };

  const handleEmptyBin = () => {
    if (!selectedBin) return;
    handleFillSliderChange(5);
  };

  const filteredBins = bins.filter(b =>
    filterStatus === 'All' ? true : b.status === filterStatus
  );

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              Smart Waste Bin Telemetry & IoT Fleet
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              Real-time ultrasonic sensor fill levels, battery health, and threshold triggers
            </p>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl text-xs font-semibold">
          {['All', 'Full', 'Warning', 'Normal'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterStatus === st ? 'bg-white text-gray-900 shadow-xs font-bold' : 'text-gray-500'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Selected Bin IoT Controller + Fleet Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive IoT Sensor Simulator (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                <h3 className="text-sm font-bold text-gray-900">
                  IoT Sensor Live Node: {selectedBin?.label}
                </h3>
              </div>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  selectedBin?.status === 'Full'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : selectedBin?.status === 'Warning'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {selectedBin?.status}
              </span>
            </div>

            {/* Fill Level Big Gauge */}
            <div className="text-center my-4">
              <div className="inline-flex items-baseline gap-1">
                <span className="text-5xl font-black text-gray-900">
                  {selectedBin?.fillLevel}%
                </span>
                <span className="text-sm font-bold text-gray-500">capacity</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {selectedBin?.wasteType} • {selectedBin?.zone}
              </p>
            </div>

            {/* Interactive Slider */}
            <div className="my-6 p-4 rounded-2xl bg-gray-50 border border-gray-200">
              <div className="flex justify-between items-center text-xs font-bold text-gray-700 mb-2">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                  Simulate Fill Level Sensor:
                </span>
                <span className="text-emerald-700 font-extrabold">{selectedBin?.fillLevel}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={selectedBin?.fillLevel || 0}
                onChange={(e) => handleFillSliderChange(parseInt(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-gray-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-semibold mt-1.5">
                <span>0% (Empty)</span>
                <span>70% (Warning)</span>
                <span>100% (Overflow)</span>
              </div>
            </div>

            {/* IoT Diagnostics */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs mb-4">
              <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center justify-center gap-1 text-gray-400 text-[10px] mb-0.5">
                  <BatteryCharging className="w-3 h-3 text-emerald-600" />
                  <span>Battery</span>
                </div>
                <span className="font-bold text-gray-800">{selectedBin?.batteryPercent}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center justify-center gap-1 text-gray-400 text-[10px] mb-0.5">
                  <Thermometer className="w-3 h-3 text-amber-500" />
                  <span>Temperature</span>
                </div>
                <span className="font-bold text-gray-800">{selectedBin?.temperatureC}°C</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                <div className="text-[10px] text-gray-400 mb-0.5">Payload Weight</div>
                <span className="font-bold text-gray-800">{selectedBin?.estimatedWeightKg} kg</span>
              </div>
            </div>

            {/* Simulated MQTT Payload */}
            <div className="p-3 rounded-xl bg-gray-900 text-emerald-400 font-mono text-[10px] overflow-x-auto mb-4">
              <p className="text-gray-400">// AWS IoT Core Topic: ecogrid/bins/{selectedBin?.id}/telemetry</p>
              <code>
                {JSON.stringify(
                  {
                    deviceId: selectedBin?.id,
                    fillPercentage: selectedBin?.fillLevel,
                    batteryVoltageV: 3.7,
                    tempC: selectedBin?.temperatureC,
                    tiltDegrees: 1.2,
                    alarm: selectedBin?.fillLevel! >= 90 ? 'OVERFLOW_TRIGGER' : 'NORMAL',
                  },
                  null,
                  1
                )}
              </code>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <button
              onClick={() => onRequestCollection(selectedBin?.id || 'B-12')}
              disabled={selectedBin?.fillLevel! < 70}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Create Immediate Collection Ticket</span>
            </button>
            <div className="flex gap-2">
              <button
                onClick={handleSimulateIotSpike}
                className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              >
                Simulate Discard (+25%)
              </button>
              <button
                onClick={handleEmptyBin}
                className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              >
                Simulate Empty (Reset)
              </button>
            </div>
          </div>
        </div>

        {/* Right: Smart Bins Fleet Table (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Campus Waste Bins Directory</h3>
              <p className="text-xs text-gray-500">
                Click any row to configure IoT simulator telemetry
              </p>
            </div>
            <span className="text-xs font-semibold text-gray-400">
              Showing {filteredBins.length} bins
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 text-gray-500 font-semibold border-y border-gray-200">
                <tr>
                  <th className="py-2.5 px-3">Bin ID</th>
                  <th className="py-2.5 px-3">Zone / Location</th>
                  <th className="py-2.5 px-3">Waste Category</th>
                  <th className="py-2.5 px-3">Fill Level</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {filteredBins.map((bin) => {
                  const isSelected = bin.id === selectedBinId;
                  return (
                    <tr
                      key={bin.id}
                      onClick={() => setSelectedBinId(bin.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-emerald-50/70 font-semibold' : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="py-3 px-3">
                        <span className="font-bold text-gray-900">{bin.label}</span>
                      </td>
                      <td className="py-3 px-3">{bin.zone}</td>
                      <td className="py-3 px-3 text-gray-500">{bin.wasteType}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-1.5 rounded-full ${
                                bin.fillLevel >= 90
                                  ? 'bg-rose-500'
                                  : bin.fillLevel >= 71
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${bin.fillLevel}%` }}
                            />
                          </div>
                          <span className="font-bold text-gray-900">{bin.fillLevel}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            bin.status === 'Full'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : bin.status === 'Warning'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {bin.status}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {bin.fillLevel >= 75 ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRequestCollection(bin.id);
                            }}
                            className="text-[10px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2 py-1 rounded-md"
                          >
                            Collect
                          </button>
                        ) : (
                          <span className="text-[10px] text-gray-400">Normal</span>
                        )}
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
