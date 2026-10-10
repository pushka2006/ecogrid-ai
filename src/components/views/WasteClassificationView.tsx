'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  ScanLine,
  Upload,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  FileText,
  ShieldCheck,
  Cpu,
  Info,
} from 'lucide-react';
import { WasteClassificationResult, WasteCategory } from '@/lib/types';
import {
  classifyWasteImage,
  MODEL_PROVIDERS,
  PRESET_SAMPLES,
  ModelProviderOption,
} from '@/lib/classificationEngine';

interface WasteClassificationViewProps {
  recentClassifications: WasteClassificationResult[];
  onNewClassification: (result: WasteClassificationResult) => void;
}

export const WasteClassificationView: React.FC<WasteClassificationViewProps> = ({
  recentClassifications,
  onNewClassification,
}) => {
  const [selectedProvider, setSelectedProvider] = useState<ModelProviderOption['id']>('bedrock-claude');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeResult, setActiveResult] = useState<WasteClassificationResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [manualOverrideCat, setManualOverrideCat] = useState<WasteCategory>('Plastic');
  const [isManualOverrideOpen, setIsManualOverrideOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setPreviewUrl(dataUrl);
      const res = await classifyWasteImage(dataUrl, selectedProvider);
      res.imageUrl = dataUrl;
      setActiveResult(res);
      onNewClassification(res);
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = async (sample: typeof PRESET_SAMPLES[0]) => {
    setIsProcessing(true);
    setPreviewUrl(sample.imageUrl);
    const res = await classifyWasteImage(sample.imageUrl, selectedProvider);
    res.imageUrl = sample.imageUrl;
    setActiveResult(res);
    onNewClassification(res);
    setIsProcessing(false);
  };

  const handleSaveOverride = () => {
    if (!activeResult) return;
    const updated: WasteClassificationResult = {
      ...activeResult,
      category: manualOverrideCat,
      confidence: 1.0,
      source: 'Manual Verified',
      disposalGuidance: `Manually verified as ${manualOverrideCat}. Deposited in designated facility bin.`,
    };
    setActiveResult(updated);
    onNewClassification(updated);
    setIsManualOverrideOpen(false);
  };

  const filteredHistory = recentClassifications.filter(c =>
    filterCategory === 'All' ? true : c.category === filterCategory
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ScanLine className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                Intelligent Waste Classification
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Multi-modal AI material taxonomy, recyclability verification & segregation guidance
              </p>
            </div>
          </div>
        </div>

        {/* Model Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500">Inference Engine:</span>
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value as any)}
            className="text-xs font-bold text-gray-800 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-hidden focus:border-emerald-500"
          >
            {MODEL_PROVIDERS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.latencyMs}ms)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Upload Workbench + Live Result */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Workbench (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-6">
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">Upload or Capture Waste Image</h3>
            <p className="text-xs text-gray-500">
              Supports single or multi-item discard captures. Automatic contamination detection.
            </p>
          </div>

          {/* Drag & drop upload area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 hover:border-emerald-500 rounded-2xl p-8 text-center bg-gray-50/60 hover:bg-emerald-50/20 cursor-pointer transition-all group relative"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            {previewUrl ? (
              <div className="relative w-36 h-36 mx-auto rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                <Image src={previewUrl} alt="Preview" fill className="object-contain p-2" />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-gray-200 flex items-center justify-center mx-auto mb-3 text-emerald-600 group-hover:scale-110 transition-transform">
                <Camera className="w-7 h-7" />
              </div>
            )}
            <p className="text-sm font-bold text-gray-900 mt-2">
              {isProcessing ? 'Running AWS Bedrock Vision Model...' : 'Click to Upload or Drag Image Here'}
            </p>
            <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG, WEBP (Max 5MB)</p>
          </div>

          {/* Preset Sample Gallery */}
          <div>
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
              Or Try Instant Benchmark Samples:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PRESET_SAMPLES.map((sample) => (
                <div
                  key={sample.name}
                  onClick={() => handleSelectPreset(sample)}
                  className="p-2.5 rounded-2xl border border-gray-200/80 hover:border-emerald-500 bg-white hover:bg-emerald-50/20 cursor-pointer text-center transition-all group"
                >
                  <div className="w-full aspect-square rounded-xl bg-gray-50 relative overflow-hidden mb-2 border border-gray-100">
                    <Image
                      src={sample.imageUrl}
                      alt={sample.name}
                      fill
                      className="object-contain p-1 group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <p className="text-xs font-bold text-gray-900 truncate">{sample.name}</p>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-1 inline-block">
                    {sample.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Classification Analysis (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-gray-900">Taxonomy & Segregation Report</h3>
              </div>
              {activeResult && (
                <button
                  onClick={() => setIsManualOverrideOpen(true)}
                  className="text-xs font-semibold text-gray-500 hover:text-emerald-700 underline"
                >
                  Manual Override
                </button>
              )}
            </div>

            {activeResult ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-black text-gray-900">
                      {activeResult.category}
                    </span>
                    <p className="text-xs text-gray-500 font-medium">
                      Inferred via {activeResult.source}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      activeResult.recyclableStatus === 'Compost'
                        ? 'bg-lime-50 text-lime-800 border border-lime-200'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {activeResult.recyclableStatus}
                  </span>
                </div>

                {/* Confidence Bar */}
                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/70">
                  <div className="flex justify-between text-xs font-bold text-gray-700 mb-1.5">
                    <span>Model Confidence Score:</span>
                    <span className="text-emerald-700">
                      {(activeResult.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-emerald-600 h-2 rounded-full"
                      style={{ width: `${activeResult.confidence * 100}%` }}
                    />
                  </div>
                </div>

                {/* Disposal Guidance */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs">
                  <p className="font-bold text-emerald-950 flex items-center gap-1.5 mb-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Actionable Disposal Protocol</span>
                  </p>
                  <p className="text-emerald-900 font-medium leading-relaxed">
                    {activeResult.disposalGuidance}
                  </p>
                </div>

                {/* Material breakdown */}
                {activeResult.materialComposition && (
                  <div>
                    <p className="text-xs font-bold text-gray-700 mb-2">Material Composition:</p>
                    <div className="space-y-2">
                      {activeResult.materialComposition.map((m, i) => (
                        <div key={i} className="text-xs">
                          <div className="flex justify-between text-gray-600 font-semibold mb-0.5">
                            <span>{m.material}</span>
                            <span>{m.percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div
                              className="bg-emerald-500 h-1.5 rounded-full"
                              style={{ width: `${m.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <ScanLine className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="text-xs font-semibold">No active item scanned.</p>
                <p className="text-[11px] text-gray-400 mt-1">
                  Upload an image or pick a benchmark sample to inspect live taxonomy results.
                </p>
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <div className="pt-4 border-t border-gray-100 text-[10px] text-gray-400 flex items-start gap-1.5 mt-4">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>
              Disclaimer: Computer vision performs probabilistic inference. Local municipal recycling mandates and material cleanliness standards must be observed.
            </span>
          </div>
        </div>
      </div>

      {/* Manual Override Dialog */}
      {isManualOverrideOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100">
            <h3 className="text-base font-bold text-gray-900 mb-2">Manual Category Override</h3>
            <p className="text-xs text-gray-500 mb-4">
              Operator human-in-the-loop audit. Overrides are logged to the DynamoDB audit table for model retraining.
            </p>
            <div className="space-y-2 mb-4">
              {(['Plastic', 'Cardboard', 'Metal', 'Glass', 'Organic', 'E-Waste'] as WasteCategory[]).map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setManualOverrideCat(cat)}
                    className={`w-full p-2.5 rounded-xl border text-left text-xs font-semibold ${
                      manualOverrideCat === cat
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setIsManualOverrideOpen(false)}
                className="px-3.5 py-2 text-xs font-bold text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveOverride}
                className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs"
              >
                Confirm Override
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Historical Classifications Log */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Classification Audit Trail</h3>
            <p className="text-xs text-gray-500">
              Verified records stored in S3 manifest bucket and DynamoDB waste registry
            </p>
          </div>
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl text-xs font-semibold">
            {['All', 'Plastic', 'Cardboard', 'Metal', 'Organic'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filterCategory === cat
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 text-gray-500 font-semibold border-y border-gray-200">
              <tr>
                <th className="py-2.5 px-3">Item / Category</th>
                <th className="py-2.5 px-3">Confidence</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">CO₂ Avoided</th>
                <th className="py-2.5 px-3">Inference Source</th>
                <th className="py-2.5 px-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
              {filteredHistory.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/80">
                  <td className="py-3 px-3 flex items-center gap-2">
                    <span className="font-bold text-gray-900">{row.category}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-emerald-700">
                      {(row.confidence * 100).toFixed(0)}%
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {row.recyclableStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-gray-900">
                    {row.co2SavingsKg} kg
                  </td>
                  <td className="py-3 px-3 text-gray-500 font-mono text-[11px]">
                    {row.source}
                  </td>
                  <td className="py-3 px-3 text-gray-400">{row.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
