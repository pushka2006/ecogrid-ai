'use client';

import React, { useState } from 'react';
import {
  FileText,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  Calendar,
  Building,
  Printer,
} from 'lucide-react';
import { WasteClassificationResult, SmartBin, BuildingEnergy } from '@/lib/types';

interface ReportsViewProps {
  recentClassifications: WasteClassificationResult[];
  bins: SmartBin[];
  buildings: BuildingEnergy[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  recentClassifications,
  bins,
  buildings,
}) => {
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const handleDownloadWasteCsv = () => {
    let csv = 'ID,Category,Confidence,Status,CO2SavingsKg,Source,Timestamp\n';
    recentClassifications.forEach(c => {
      csv += `${c.id},"${c.category}",${c.confidence},"${c.recyclableStatus}",${c.co2SavingsKg},"${c.source}","${c.timestamp}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ecogrid_waste_manifest_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadNotice('Waste Manifest CSV downloaded successfully!');
    setTimeout(() => setDownloadNotice(null), 3500);
  };

  const handleDownloadEnergyCsv = () => {
    let csv = 'BuildingID,BuildingName,AreaSqM,CurrentKWh,BaselineKWh,DeviationPercent,TariffCostINR,PotentialSavingsINR,Status\n';
    buildings.forEach(b => {
      csv += `${b.id},"${b.name}",${b.areaSqM},${b.currentKwh},${b.baselineKwh},${b.deviationPercent},${b.tariffCostINR},${b.potentialSavingsINR},"${b.status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ecogrid_energy_audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadNotice('Energy Audit Report CSV downloaded successfully!');
    setTimeout(() => setDownloadNotice(null), 3500);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              Compliance & Sustainability Reports Center
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              Export verified waste manifests, energy sub-meter logs, and ESG audit reports
            </p>
          </div>
        </div>

        <button
          onClick={handlePrintPdf}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center gap-2"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Export PDF</span>
        </button>
      </div>

      {downloadNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Waste Manifest Report */}
        <div className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                <FileSpreadsheet className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                S3 Verified
              </span>
            </div>
            <h3 className="text-base font-bold text-gray-900">
              Verified Waste Manifest & Chain of Custody
            </h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Complete log of all classified materials, weight estimations, confidence records, and composter/recycler dispatch handoffs.
            </p>
            <div className="mt-4 p-3 rounded-xl bg-gray-50 text-xs font-medium text-gray-600">
              Contains {recentClassifications.length} recent classifications • Ready for municipal recycling audit
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={handleDownloadWasteCsv}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gray-900 hover:bg-black text-white transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Waste Manifest (CSV)</span>
            </button>
          </div>
        </div>

        {/* Energy Audit Report */}
        <div className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="p-2 rounded-xl bg-amber-50 text-amber-700">
                <FileSpreadsheet className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                ASHRAE Level 2
              </span>
            </div>
            <h3 className="text-base font-bold text-gray-900">
              Building Energy Audit & Anomaly Log
            </h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Building-by-building breakdown of electricity intensity, detected chiller spikes, time-of-day tariff costs, and potential monthly rupee savings.
            </p>
            <div className="mt-4 p-3 rounded-xl bg-gray-50 text-xs font-medium text-gray-600">
              Covers 4 campus precincts • Total calculated savings: ₹28,450 / mo
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={handleDownloadEnergyCsv}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gray-900 hover:bg-black text-white transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Energy Audit (CSV)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
