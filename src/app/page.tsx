'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar, NavTabId } from '@/components/Sidebar';
import { HeroBanner } from '@/components/HeroBanner';
import { KpiRow } from '@/components/KpiRow';
import { WasteClassificationCard } from '@/components/WasteClassificationCard';
import { BinMonitoringCard } from '@/components/BinMonitoringCard';
import { CollectionRouteCard } from '@/components/CollectionRouteCard';
import { AiAssistantWidget } from '@/components/AiAssistantWidget';
import { RecentAlertsWidget } from '@/components/RecentAlertsWidget';
import { EnergyMonitoringCard } from '@/components/EnergyMonitoringCard';
import { RenewableEnergyCard } from '@/components/RenewableEnergyCard';
import { SustainabilityImpactCard } from '@/components/SustainabilityImpactCard';
import { FooterBanner } from '@/components/FooterBanner';

// Sub-Views
import { WasteClassificationView } from '@/components/views/WasteClassificationView';
import { BinMonitoringView } from '@/components/views/BinMonitoringView';
import { CollectionRoutingView } from '@/components/views/CollectionRoutingView';
import { EnergyMonitoringView } from '@/components/views/EnergyMonitoringView';
import { RenewableEnergyView } from '@/components/views/RenewableEnergyView';
import { SustainabilityImpactView } from '@/components/views/SustainabilityImpactView';
import { ReportsView } from '@/components/views/ReportsView';
import { AiAssistantView } from '@/components/views/AiAssistantView';
import { AdministrationView } from '@/components/views/AdministrationView';

// State & Mock Data
import {
  INITIAL_RECENT_CLASSIFICATIONS,
  INITIAL_SMART_BINS,
  INITIAL_COLLECTION_ROUTE,
  INITIAL_HOURLY_ENERGY,
  INITIAL_BUILDINGS_ENERGY,
  INITIAL_RENEWABLE_WEEKLY,
  INITIAL_ALERTS,
  INITIAL_CHAT_MESSAGES,
} from '@/lib/mockData';
import {
  SmartBin,
  WasteClassificationResult,
  CollectionRoute,
  EnergyHourlyReading,
  BuildingEnergy,
  RenewableDaily,
  ChatMessage,
  SystemAlert,
  UserRole,
} from '@/lib/types';

export default function EcoGridDashboard() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<NavTabId>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('Admin');
  const [isAwsCloudMode, setIsAwsCloudMode] = useState(true);

  // Domain States
  const [recentClassifications, setRecentClassifications] = useState<WasteClassificationResult[]>(
    INITIAL_RECENT_CLASSIFICATIONS
  );
  const [bins, setBins] = useState<SmartBin[]>(INITIAL_SMART_BINS);
  const [selectedBinId, setSelectedBinId] = useState<string>('B-12');
  const [route, setRoute] = useState<CollectionRoute>(INITIAL_COLLECTION_ROUTE);
  const [hourlyEnergy, setHourlyEnergy] = useState<EnergyHourlyReading[]>(INITIAL_HOURLY_ENERGY);
  const [buildings, setBuildings] = useState<BuildingEnergy[]>(INITIAL_BUILDINGS_ENERGY);
  const [renewableWeekly, setRenewableWeekly] = useState<RenewableDaily[]>(INITIAL_RENEWABLE_WEEKLY);
  const [alerts, setAlerts] = useState<SystemAlert[]>(INITIAL_ALERTS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);

  // Handlers
  const handleNewClassification = (res: WasteClassificationResult) => {
    setRecentClassifications((prev) => [res, ...prev]);
  };

  const handleUpdateBin = (updatedBin: SmartBin) => {
    setBins((prev) => prev.map((b) => (b.id === updatedBin.id ? updatedBin : b)));
  };

  const handleRequestCollection = (binId: string) => {
    setBins((prev) =>
      prev.map((b) => (b.id === binId ? { ...b, urgentNeedsCollection: true, status: 'Full' } : b))
    );
    const targetBin = bins.find((b) => b.id === binId);
    const newAlert: SystemAlert = {
      id: `alt-${Date.now()}`,
      title: `${targetBin?.label || binId} is 92% full`,
      subtitle: `${targetBin?.zone || 'North Block'} • Just now`,
      timeAgo: 'Just now',
      type: 'full',
      color: 'red',
      read: false,
      actionRoute: 'routing',
    };
    setAlerts((prev) => [newAlert, ...prev]);
    setActiveTab('routing');
  };

  const handleAlertClick = (alert: SystemAlert) => {
    setAlerts((prev) => prev.map((a) => (a.id === alert.id ? { ...a, read: true } : a)));
    if (alert.actionRoute) {
      setActiveTab(alert.actionRoute as NavTabId);
    }
  };

  const handleSendMessage = (msg: ChatMessage) => {
    setChatMessages((prev) => [...prev, msg]);
  };

  const handleImportCsvReadings = (readings: EnergyHourlyReading[]) => {
    setHourlyEnergy(readings);
  };

  return (
    <div className="min-h-screen flex bg-[#f4f7f5] text-gray-900 font-sans selection:bg-emerald-500 selection:text-white antialiased">
      {/* Left Full-Height Forest Green Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Right Main App Column */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header Navbar */}
        <Navbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          userRole={userRole}
          onRoleChange={setUserRole}
          alerts={alerts}
          onAlertClick={handleAlertClick}
          isAwsCloudMode={isAwsCloudMode}
          onToggleCloudMode={() => setIsAwsCloudMode(!isAwsCloudMode)}
        />

        {/* Scrollable Main Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-5 animate-in fade-in duration-300">
              {/* 1. Hero Welcome Banner */}
              <HeroBanner userName="Pushkar" campusName="Green Valley Campus" />

              {/* 2. Top 5 Metric KPI Cards */}
              <KpiRow
                totalWasteKg={2450}
                recyclableKg={1320}
                totalKwh={8650}
                solarKwh={2860}
                co2Tons={4.8}
              />

              {/* 3. Middle Section: 3 Left/Center Cards + 1 Right AI Column */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                {/* Left 9 Columns (3 equal cards side-by-side) */}
                <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Middle Row Card 1: Waste Classification */}
                  <WasteClassificationCard
                    recentClassifications={recentClassifications}
                    onViewAllHistory={() => setActiveTab('classification')}
                    onNewClassification={handleNewClassification}
                  />

                  {/* Middle Row Card 2: Bin Monitoring */}
                  <BinMonitoringCard
                    bins={bins}
                    selectedBinId={selectedBinId}
                    onSelectBin={setSelectedBinId}
                    onViewAllBins={() => setActiveTab('bins')}
                  />

                  {/* Middle Row Card 3: Collection Route */}
                  <CollectionRouteCard
                    route={route}
                    onViewRoute={() => setActiveTab('routing')}
                    onReoptimize={() => setActiveTab('routing')}
                  />
                </div>

                {/* Right 3 Columns: AI Assistant Widget */}
                <div className="lg:col-span-3 flex flex-col">
                  <AiAssistantWidget
                    messages={chatMessages}
                    onSendMessage={handleSendMessage}
                    bins={bins}
                    buildings={buildings}
                    totalWasteKg={2450}
                    recyclableKg={1320}
                    totalKwh={8650}
                    solarKwh={2860}
                    onExpandView={() => setActiveTab('assistant')}
                  />
                </div>
              </div>

              {/* 4. Bottom Row: 3 Left/Center Cards + 1 Right Alerts Widget */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                {/* Left 9 Columns (3 equal cards side-by-side) */}
                <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Bottom Row Card 1: Energy Monitoring */}
                  <EnergyMonitoringCard
                    readings={hourlyEnergy}
                    onViewDetails={() => setActiveTab('energy')}
                  />

                  {/* Bottom Row Card 2: Renewable Energy */}
                  <RenewableEnergyCard
                    weeklyData={renewableWeekly}
                    onViewDetails={() => setActiveTab('renewable')}
                  />

                  {/* Bottom Row Card 3: Sustainability Impact */}
                  <SustainabilityImpactCard
                    onViewReport={() => setActiveTab('sustainability')}
                    wasteDivertedKg={1890}
                    co2Tons={4.8}
                    costSavingsINR={28450}
                    energySavedKwh={4320}
                  />
                </div>

                {/* Right 3 Columns: Recent Alerts Widget */}
                <div className="lg:col-span-3 flex flex-col">
                  <RecentAlertsWidget
                    alerts={alerts}
                    onViewAllAlerts={() => setActiveTab('bins')}
                    onAlertClick={handleAlertClick}
                  />
                </div>
              </div>

              {/* 5. Footer Eco Banner */}
              <FooterBanner />
            </div>
          )}

          {/* Sub-Views when respective tab is active */}
          {activeTab === 'classification' && (
            <div className="animate-in fade-in duration-300">
              <WasteClassificationView
                recentClassifications={recentClassifications}
                onNewClassification={handleNewClassification}
              />
            </div>
          )}

          {activeTab === 'bins' && (
            <div className="animate-in fade-in duration-300">
              <BinMonitoringView
                bins={bins}
                onUpdateBin={handleUpdateBin}
                onRequestCollection={handleRequestCollection}
              />
            </div>
          )}

          {activeTab === 'routing' && (
            <div className="animate-in fade-in duration-300">
              <CollectionRoutingView
                route={route}
                bins={bins}
                onUpdateRoute={setRoute}
              />
            </div>
          )}

          {activeTab === 'energy' && (
            <div className="animate-in fade-in duration-300">
              <EnergyMonitoringView
                hourlyReadings={hourlyEnergy}
                buildings={buildings}
                onImportCsvReadings={handleImportCsvReadings}
              />
            </div>
          )}

          {activeTab === 'renewable' && (
            <div className="animate-in fade-in duration-300">
              <RenewableEnergyView weeklyData={renewableWeekly} />
            </div>
          )}

          {activeTab === 'sustainability' && (
            <div className="animate-in fade-in duration-300">
              <SustainabilityImpactView
                totalWasteKg={2450}
                recyclableKg={1320}
                wasteDivertedKg={1890}
                solarKwh={2860}
                co2Tons={4.8}
                costSavingsINR={28450}
              />
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="animate-in fade-in duration-300">
              <ReportsView
                recentClassifications={recentClassifications}
                bins={bins}
                buildings={buildings}
              />
            </div>
          )}

          {activeTab === 'assistant' && (
            <div className="animate-in fade-in duration-300">
              <AiAssistantView
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                bins={bins}
                buildings={buildings}
                totalWasteKg={2450}
                recyclableKg={1320}
                totalKwh={8650}
                solarKwh={2860}
              />
            </div>
          )}

          {activeTab === 'administration' && (
            <div className="animate-in fade-in duration-300">
              <AdministrationView
                userRole={userRole}
                onRoleChange={setUserRole}
                isAwsCloudMode={isAwsCloudMode}
                onToggleCloudMode={() => setIsAwsCloudMode(!isAwsCloudMode)}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
