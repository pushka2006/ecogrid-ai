'use client';

import React from 'react';
import { Sun, MapPin } from 'lucide-react';

interface HeroBannerProps {
  userName?: string;
  campusName?: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  userName = 'Pushkar',
  campusName = 'Green Valley Campus',
}) => {
  return (
    <div
      className="relative rounded-3xl overflow-hidden shadow-md min-h-[150px] flex items-center justify-between p-6 sm:p-8 text-white bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(6, 78, 59, 0.88) 0%, rgba(6, 78, 59, 0.65) 55%, rgba(6, 78, 59, 0.82) 100%), url('/banner.jpg')`,
      }}
    >
      {/* Left text message */}
      <div className="max-w-xl z-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-md">
          Good Morning, {userName}!
        </h2>
        <p className="text-xs sm:text-sm text-emerald-100 font-medium mt-1.5 drop-shadow-sm">
          Monitor waste, optimize energy, and build a more sustainable future.
        </p>
      </div>

      {/* Right weather / campus glassmorphism badge */}
      <div className="hidden sm:flex items-center gap-3.5 px-5 py-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 shadow-lg z-10">
        <div className="w-10 h-10 rounded-xl bg-amber-400/25 border border-amber-300/40 flex items-center justify-center text-amber-300 shadow-inner">
          <Sun className="w-6 h-6 animate-[spin_16s_linear_infinite]" />
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 justify-end">
            <span className="text-xl font-black text-white leading-none">28°C</span>
            <span className="text-xs font-semibold text-emerald-100/90">Clear Sky</span>
          </div>
          <div className="flex items-center gap-1 justify-end text-[11px] text-emerald-200 font-medium mt-1">
            <MapPin className="w-3 h-3 text-emerald-300" />
            <span>{campusName}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
