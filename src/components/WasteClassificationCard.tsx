'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  Upload,
  Camera,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Info,
  X,
  RefreshCw,
} from 'lucide-react';
import { WasteClassificationResult } from '@/lib/types';
import { classifyWasteImage, MODEL_PROVIDERS } from '@/lib/classificationEngine';

interface WasteClassificationCardProps {
  recentClassifications: WasteClassificationResult[];
  onViewAllHistory: () => void;
  onNewClassification: (result: WasteClassificationResult) => void;
}

export const WasteClassificationCard: React.FC<WasteClassificationCardProps> = ({
  recentClassifications,
  onViewAllHistory,
  onNewClassification,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeResult, setActiveResult] = useState<WasteClassificationResult | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<'bedrock-claude' | 'aws-rekognition' | 'local-mobilenet'>('bedrock-claude');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const res = await classifyWasteImage(dataUrl, selectedProvider);
      res.imageUrl = dataUrl;
      setActiveResult(res);
      onNewClassification(res);
      setIsAnalyzing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSampleClick = async (sample: WasteClassificationResult) => {
    setIsAnalyzing(true);
    const res = await classifyWasteImage(sample.imageUrl || sample.category, selectedProvider);
    res.imageUrl = sample.imageUrl;
    setActiveResult(res);
    setIsAnalyzing(false);
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200/70 shadow-xs flex flex-col justify-between h-full">
      {/* Card Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Camera className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Waste Classification</h3>
          </div>
          <button
            onClick={onViewAllHistory}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group"
          >
            <span>View History</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Drag & drop upload area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative border-2 border-dashed border-gray-200 hover:border-emerald-500/60 rounded-2xl p-6 text-center bg-gray-50/50 hover:bg-emerald-50/20 cursor-pointer transition-all group"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-gray-200 flex items-center justify-center mx-auto mb-2 text-gray-500 group-hover:text-emerald-600 group-hover:scale-105 transition-all">
            {isAnalyzing ? (
              <RefreshCw className="w-5 h-5 animate-spin text-emerald-600" />
            ) : (
              <Camera className="w-5 h-5" />
            )}
          </div>
          <p className="text-xs font-bold text-gray-800">
            {isAnalyzing ? 'Analyzing with AWS AI...' : 'Drop an image or click to upload'}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Supports: JPG, PNG (Max 5MB)
          </p>
        </div>

        {/* Recent Classifications header */}
        <div className="mt-4 mb-2.5">
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
            Recent Classifications
          </p>
        </div>

        {/* 4 Sample Cards Grid */}
        <div className="grid grid-cols-4 gap-2.5">
          {recentClassifications.slice(0, 4).map((item) => (
            <div
              key={item.id}
              onClick={() => handleSampleClick(item)}
              className="bg-white rounded-xl border border-gray-200/80 hover:border-emerald-400 p-2 text-center cursor-pointer transition-all hover:shadow-xs group flex flex-col items-center"
            >
              <div className="w-14 h-14 rounded-lg bg-gray-50 relative overflow-hidden mb-1.5 flex items-center justify-center border border-gray-100">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.category}
                    fill
                    sizes="64px"
                    className="object-contain p-1 group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <span className="text-xs font-bold text-gray-400">{item.category[0]}</span>
                )}
              </div>
              <p className="text-xs font-bold text-gray-900 group-hover:text-emerald-700 leading-tight">
                {item.category}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {Math.round(item.confidence * 100)}% confidence
              </p>
              <div className="mt-1.5">
                <span
                  className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    item.recyclableStatus === 'Compost'
                      ? 'bg-lime-50 text-lime-800 border border-lime-200/80'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200/80'
                  }`}
                >
                  {item.recyclableStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Classification Result Modal */}
      {activeResult && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">AI Waste Classification Result</h3>
                  <p className="text-[11px] text-gray-500 font-medium">
                    Processed via {activeResult.source}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveResult(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 flex gap-4">
              <div className="w-28 h-28 rounded-2xl bg-gray-50 border border-gray-200/80 relative overflow-hidden shrink-0">
                {activeResult.imageUrl ? (
                  <Image
                    src={activeResult.imageUrl}
                    alt={activeResult.category}
                    fill
                    className="object-contain p-2"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">
                    {activeResult.category}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-gray-900">
                    {activeResult.category}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      activeResult.recyclableStatus === 'Compost'
                        ? 'bg-lime-50 text-lime-800 border border-lime-200'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {activeResult.recyclableStatus}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs">
                  <span className="font-semibold text-gray-700">Confidence:</span>
                  <span className="font-bold text-emerald-700">
                    {(activeResult.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs">
                  <span className="font-semibold text-gray-700">Avoided CO₂:</span>
                  <span className="font-bold text-emerald-700">
                    {activeResult.co2SavingsKg} kg CO₂e
                  </span>
                </div>
              </div>
            </div>

            {/* Disposal Guidance */}
            <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 text-xs">
              <p className="font-bold text-emerald-950 flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Disposal & Segregation Guidance</span>
              </p>
              <p className="text-emerald-900/90 leading-relaxed font-medium">
                {activeResult.disposalGuidance}
              </p>
            </div>

            {/* Material composition */}
            {activeResult.materialComposition && activeResult.materialComposition.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-bold text-gray-700 mb-2">Spectroscopic Composition:</p>
                <div className="space-y-1.5">
                  {activeResult.materialComposition.map((m, idx) => (
                    <div key={idx} className="text-xs">
                      <div className="flex justify-between text-gray-600 font-medium mb-0.5">
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

            {/* Model Provider Selector */}
            <div className="mt-4 pt-3 border-t border-gray-100">
              <p className="text-[11px] font-semibold text-gray-500 mb-1.5">Inference Endpoint:</p>
              <div className="grid grid-cols-3 gap-2">
                {MODEL_PROVIDERS.slice(0, 3).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProvider(p.id as any)}
                    className={`p-2 rounded-xl border text-[11px] font-semibold transition-all ${
                      selectedProvider === p.id
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <span className="block truncate">{p.name.split('—')[0]}</span>
                    <span className="text-[9px] text-gray-400 block">{p.latencyMs}ms</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-[10px] text-gray-400 mt-3 flex items-start gap-1">
              <Info className="w-3 h-3 text-gray-400 shrink-0 mt-0.5" />
              <span>
                Computer vision provides probabilistic material categorization. Multi-layer packaging requires mechanical separation verification.
              </span>
            </p>

            <div className="mt-4 flex gap-2 justify-end">
              <button
                onClick={() => setActiveResult(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
