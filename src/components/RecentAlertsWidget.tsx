'use client';

import React from 'react';
import {
  Bell,
  ArrowRight,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { SystemAlert } from '@/lib/types';

interface RecentAlertsWidgetProps {
  alerts: SystemAlert[];
  onViewAllAlerts: () => void;
  onAlertClick: (alert: SystemAlert) => void;
}

export const RecentAlertsWidget: React.FC<RecentAlertsWidgetProps> = ({
  alerts,
  onViewAllAlerts,
  onAlertClick,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200/70 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Bell className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Recent Alerts</h3>
          </div>
          <button
            onClick={onViewAllAlerts}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          {alerts.map((alert) => {
            return (
              <div
                key={alert.id}
                onClick={() => onAlertClick(alert)}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50/80 cursor-pointer transition-colors group"
              >
                {/* Circle Icon */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    alert.color === 'red'
                      ? 'bg-rose-100 text-rose-600'
                      : alert.color === 'amber'
                      ? 'bg-amber-100 text-amber-600'
                      : alert.color === 'green'
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-blue-100 text-blue-600'
                  }`}
                >
                  {alert.color === 'red' && <AlertCircle className="w-4 h-4" />}
                  {alert.color === 'amber' && <AlertTriangle className="w-4 h-4" />}
                  {alert.color === 'green' && <CheckCircle2 className="w-4 h-4" />}
                  {alert.color === 'blue' && <FileText className="w-4 h-4" />}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 group-hover:text-emerald-700 truncate transition-colors">
                    {alert.title}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5 font-medium">
                    {alert.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
