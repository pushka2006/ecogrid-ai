'use client';

import React from 'react';
import { Leaf } from 'lucide-react';

export const FooterBanner: React.FC = () => {
  return (
    <div className="relative rounded-2xl bg-[#eef8f2] border border-emerald-200/60 p-4 flex items-center justify-between overflow-hidden shadow-xs">
      <div className="flex items-center gap-3 z-10">
        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
          <Leaf className="w-4 h-4" />
        </div>
        <p className="text-xs sm:text-sm font-semibold text-emerald-950 tracking-tight">
          Better waste management and clean energy today for a healthier planet tomorrow.
        </p>
      </div>

      {/* Hand-drawn leaf doodle on right matching screenshot */}
      <div className="hidden sm:block z-10 pr-2">
        <svg className="w-16 h-12 text-emerald-600/70" viewBox="0 0 60 40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 32 C 18 10, 42 6, 50 14 C 42 28, 24 36, 12 32 Z" />
          <path d="M12 32 C 26 24, 38 18, 50 14" />
          <path d="M26 24 C 28 20, 32 18, 36 17" />
          <path d="M22 28 C 24 30, 28 30, 32 29" />
          {/* Subtle sparkle dots */}
          <circle cx="6" cy="18" r="1" fill="currentColor" />
          <circle cx="54" cy="8" r="1.2" fill="currentColor" />
          <circle cx="56" cy="24" r="0.8" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
};
