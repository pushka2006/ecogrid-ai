'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Truck,
  RotateCcw,
  CheckCircle2,
  TrendingDown,
  Navigation,
  Fuel,
  Leaf,
  Layers,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import { CollectionRoute, SmartBin } from '@/lib/types';
import { optimizeCollectionRoute } from '@/lib/routingEngine';
import { RealTimeWasteTrackerMap } from '@/components/RealTimeWasteTrackerMap';

interface CollectionRoutingViewProps {
  route: CollectionRoute;
  bins: SmartBin[];
  onUpdateRoute: (newRoute: CollectionRoute) => void;
}

export const CollectionRoutingView: React.FC<CollectionRoutingViewProps> = ({
  route,
  bins,
  onUpdateRoute,
}) => {
  const [vehicleCapacity, setVehicleCapacity] = useState(500);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isDispatched, setIsDispatched] = useState(false);

  const handleReoptimize = () => {
    setIsCalculating(true);
    setTimeout(() => {
      const newRoute = optimizeCollectionRoute(bins, { x: 350, y: 300 }, vehicleCapacity);
      onUpdateRoute(newRoute);
      setIsCalculating(false);
    }, 500);
  };

  const handleDispatch = () => {
    setIsDispatched(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const totalPayloadKg = route.stops.reduce((acc, s) => acc + s.estimatedKg, 0);
  const capacityPercent = Math.min(100, Math.round((totalPayloadKg / vehicleCapacity) * 100));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              Smart Waste Collection & Route Optimization
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              2-Opt heuristic Traveling Salesperson solver • Payload balancing & fuel reduction
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleReoptimize}
            disabled={isCalculating}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors flex items-center gap-2"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isCalculating ? 'animate-spin' : ''}`} />
            <span>Re-solve TSP Route</span>
          </button>
          <button
            onClick={handleDispatch}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center gap-2"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>{isDispatched ? 'Crew Dispatched ✓' : 'Dispatch EV Crew'}</span>
          </button>
        </div>
      </div>

      {/* KPI Comparison Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Distance comparison */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200/70 shadow-xs">
          <span className="text-xs font-semibold text-gray-500">Route Distance</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-emerald-700">
              {route.optimizedDistanceKm} km
            </span>
            <span className="text-xs text-gray-400 line-through">
              {route.baselineDistanceKm} km
            </span>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
            -28% Distance Avoided
          </span>
        </div>

        {/* Time saved */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200/70 shadow-xs">
          <span className="text-xs font-semibold text-gray-500">Service Duration</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-gray-900">
              {route.optimizedTimeMin} min
            </span>
            <span className="text-xs text-gray-400 line-through">
              {route.baselineTimeMin} min
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1 font-medium">
            24 minutes saved per shift
          </p>
        </div>

        {/* Fuel & Carbon */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200/70 shadow-xs">
          <span className="text-xs font-semibold text-gray-500">Carbon Abatement</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-emerald-700">
              {route.co2AvoidedKg} kg
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1 font-medium">
            3.8 L diesel combustion avoided
          </p>
        </div>

        {/* Vehicle Payload */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200/70 shadow-xs">
          <span className="text-xs font-semibold text-gray-500">EV Truck Payload</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-gray-900">
              {totalPayloadKg.toFixed(0)} <span className="text-xs text-gray-500">/ {vehicleCapacity} kg</span>
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
            <div
              className={`h-1.5 rounded-full ${
                capacityPercent >= 85 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${capacityPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Real-Time Real GPS Route Map */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-emerald-600 animate-pulse" />
            <h3 className="text-sm font-bold text-gray-900">Live GPS GIS Route Tracking & Vehicle Dispatch</h3>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            Real GPS Satellite Active
          </span>
        </div>
        <RealTimeWasteTrackerMap />
      </div>

      {/* Manifest & Stops Itinerary */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
        <h3 className="text-sm font-bold text-gray-900 mb-1">Turn-by-Turn Collection Manifest</h3>
        <p className="text-xs text-gray-500 mb-4">
          Ordered stops generated via Traveling Salesperson 2-Opt Algorithm
        </p>

        <div className="space-y-3">
          {route.stops.map((stop) => (
            <div
              key={stop.stopNumber}
              className="p-4 rounded-2xl bg-gray-50/70 hover:bg-emerald-50/30 border border-gray-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  {stop.stopNumber}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">{stop.locationName}</h4>
                  <p className="text-[11px] text-gray-500 font-medium">
                    {stop.wasteType} • Est. Weight: {stop.estimatedKg} kg
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {stop.fillLevel > 0 && (
                  <span className="text-xs font-bold text-gray-700 bg-white border border-gray-200 px-2.5 py-1 rounded-xl">
                    Fill: {stop.fillLevel}%
                  </span>
                )}
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
                  {stop.binId === 'DEPOT' ? 'Final Yard Drop' : 'Scheduled Pickup'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
