'use client';

import React from 'react';
import { Navigation, Radio, MapPin, ShieldCheck, Zap } from 'lucide-react';
import { RealTimeWasteTrackerMap } from '@/components/RealTimeWasteTrackerMap';

export const RealTimeWasteTrackerView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                Real-Time Waste & Vehicle Location System
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold tracking-wide uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live GPS Satellite
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Interactive Leaflet GIS map with browser GPS geolocation, moving EV trucks, and IoT sensor telemetry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200 px-3.5 py-2 rounded-2xl">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Encrypted IoT Telemetry Protocol (MQTT / WebSockets)</span>
        </div>
      </div>

      {/* Main Interactive Map Component */}
      <RealTimeWasteTrackerMap />
    </div>
  );
};
