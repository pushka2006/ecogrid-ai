'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Navigation,
  MapPin,
  Truck,
  Trash2,
  AlertTriangle,
  Compass,
  Zap,
  Activity,
  Plus,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Maximize2,
  Layers,
  Radio,
} from 'lucide-react';
import type L from 'leaflet';

export interface RealLocationBin {
  id: string;
  name: string;
  lat: number;
  lng: number;
  fillLevel: number; // 0 - 100
  type: 'General' | 'Recyclable' | 'Organic' | 'E-Waste' | 'Hazardous';
  battery: number;
  temp: number;
  lastUpdated: string;
  status: 'Normal' | 'Warning' | 'Critical';
}

export interface RealTimeTruck {
  id: string;
  driver: string;
  lat: number;
  lng: number;
  targetBinId?: string;
  speedKmH: number;
  capacityKg: number;
  currentPayloadKg: number;
  batteryPercent: number;
  status: 'Collecting' | 'En Route' | 'Returning' | 'Idle';
  waypoints: [number, number][];
  currentWaypointIdx: number;
}

interface RealTimeWasteTrackerMapProps {
  onBinSelect?: (bin: RealLocationBin) => void;
}

const CITY_PRESETS = [
  { name: 'San Francisco, CA', lat: 37.7749, lng: -122.4194 },
  { name: 'New York City, NY', lat: 40.7128, lng: -74.006 },
  { name: 'London, UK', lat: 51.5074, lng: -0.1278 },
  { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503 },
  { name: 'New Delhi, India', lat: 28.6139, lng: 77.209 },
  { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093 },
];

export const RealTimeWasteTrackerMap: React.FC<RealTimeWasteTrackerMapProps> = ({ onBinSelect }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const leafletRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const truckMarkersRef = useRef<{ [key: string]: L.Marker }>({});
  const userMarkerRef = useRef<L.Marker | null>(null);
  const userAccuracyCircleRef = useRef<L.Circle | null>(null);

  // States
  const [centerCoords, setCenterCoords] = useState<{ lat: number; lng: number }>({
    lat: 37.7749,
    lng: -122.4194,
  });
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('All');
  const [isAddMode, setIsAddMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ type: 'bin' | 'truck'; data: any } | null>(null);
  const [liveLogs, setLiveLogs] = useState<{ id: string; time: string; msg: string; type: 'info' | 'warn' | 'success' }[]>([]);
  const [isLeafletReady, setIsLeafletReady] = useState(false);

  // Initial Real Bins around SF (or dynamic center)
  const [bins, setBins] = useState<RealLocationBin[]>([
    {
      id: 'BIN-GPS-101',
      name: 'Market St Smart Hub Bin',
      lat: 37.7749 + 0.003,
      lng: -122.4194 + 0.002,
      fillLevel: 88,
      type: 'Recyclable',
      battery: 94,
      temp: 21.5,
      lastUpdated: 'Just now',
      status: 'Critical',
    },
    {
      id: 'BIN-GPS-102',
      name: 'Union Square Eco Station',
      lat: 37.7749 - 0.002,
      lng: -122.4194 + 0.004,
      fillLevel: 45,
      type: 'General',
      battery: 89,
      temp: 22.1,
      lastUpdated: 'Just now',
      status: 'Normal',
    },
    {
      id: 'BIN-GPS-103',
      name: 'Financial District Compost',
      lat: 37.7749 + 0.005,
      lng: -122.4194 - 0.003,
      fillLevel: 92,
      type: 'Organic',
      battery: 76,
      temp: 24.0,
      lastUpdated: 'Just now',
      status: 'Critical',
    },
    {
      id: 'BIN-GPS-104',
      name: 'Embarcadero E-Waste Drop',
      lat: 37.7749 - 0.004,
      lng: -122.4194 - 0.005,
      fillLevel: 30,
      type: 'E-Waste',
      battery: 98,
      temp: 20.0,
      lastUpdated: 'Just now',
      status: 'Normal',
    },
    {
      id: 'BIN-GPS-105',
      name: 'Mission District Hazardous Vault',
      lat: 37.7749 + 0.001,
      lng: -122.4194 - 0.007,
      fillLevel: 72,
      type: 'Hazardous',
      battery: 62,
      temp: 23.4,
      lastUpdated: 'Just now',
      status: 'Warning',
    },
  ]);

  // Initial Real Moving EV Trucks
  const [trucks, setTrucks] = useState<RealTimeTruck[]>([
    {
      id: 'EV-TRUCK-01',
      driver: 'Alex Rivers',
      lat: 37.7749 + 0.002,
      lng: -122.4194 + 0.001,
      speedKmH: 28,
      capacityKg: 600,
      currentPayloadKg: 340,
      batteryPercent: 82,
      status: 'Collecting',
      waypoints: [
        [37.7749 + 0.002, -122.4194 + 0.001],
        [37.7749 + 0.004, -122.4194 + 0.003],
        [37.7749 + 0.005, -122.4194 - 0.002],
        [37.7749 + 0.001, -122.4194 - 0.004],
      ],
      currentWaypointIdx: 0,
    },
    {
      id: 'EV-TRUCK-02',
      driver: 'Elena Rostova',
      lat: 37.7749 - 0.003,
      lng: -122.4194 - 0.002,
      speedKmH: 34,
      capacityKg: 800,
      currentPayloadKg: 520,
      batteryPercent: 68,
      status: 'En Route',
      waypoints: [
        [37.7749 - 0.003, -122.4194 - 0.002],
        [37.7749 - 0.005, -122.4194 + 0.001],
        [37.7749 - 0.002, -122.4194 + 0.004],
      ],
      currentWaypointIdx: 0,
    },
  ]);

  const addLog = (msg: string, type: 'info' | 'warn' | 'success' = 'info') => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLiveLogs((prev) => [{ id: `${Date.now()}-${Math.random()}`, time, msg, type }, ...prev.slice(0, 25)]);
  };

  // 1. Client-Side Dynamic Import & Map Initialization
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    let isMounted = true;

    const initMap = async () => {
      if (typeof window === 'undefined') return;
      const LModule = (await import('leaflet')).default;
      if (!isMounted || !mapContainerRef.current) return;

      leafletRef.current = LModule;

      const map = LModule.map(mapContainerRef.current, {
        center: [centerCoords.lat, centerCoords.lng],
        zoom: 14,
        zoomControl: false,
      });

      LModule.control.zoom({ position: 'topright' }).addTo(map);

      LModule.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;
      setIsLeafletReady(true);
      addLog('Leaflet Real-Time Waste GIS Engine initialized.', 'success');

      map.on('click', (e: any) => {
        if (isAddMode) {
          const newBin: RealLocationBin = {
            id: `BIN-GPS-${Math.floor(100 + Math.random() * 900)}`,
            name: `Custom IoT Bin (${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)})`,
            lat: e.latlng.lat,
            lng: e.latlng.lng,
            fillLevel: Math.floor(20 + Math.random() * 60),
            type: 'Recyclable',
            battery: 95,
            temp: 22.0,
            lastUpdated: 'Just now',
            status: 'Normal',
          };
          setBins((prev) => [...prev, newBin]);
          setIsAddMode(false);
          addLog(
            `New IoT Waste Bin deployed at [${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}]`,
            'success'
          );
        }
      });
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // 2. Request Browser Real GPS Location
  const handleRequestUserLocation = () => {
    setIsLocating(true);
    setLocationError(null);

    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setIsLocating(false);
      return;
    }

    const LModule = leafletRef.current;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setIsLocating(false);

        if (mapRef.current && LModule) {
          mapRef.current.flyTo([latitude, longitude], 16, { animate: true, duration: 1.5 });

          if (userMarkerRef.current) {
            userMarkerRef.current.setLatLng([latitude, longitude]);
          } else {
            const userIcon = LModule.divIcon({
              className: 'custom-user-marker',
              html: `
                <div class="relative flex items-center justify-center w-8 h-8">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <div class="relative w-6 h-6 rounded-full bg-sky-500 border-2 border-white shadow-lg flex items-center justify-center text-white">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="8"/></svg>
                  </div>
                </div>
              `,
              iconSize: [32, 32],
              iconAnchor: [16, 16],
            });
            userMarkerRef.current = LModule.marker([latitude, longitude], { icon: userIcon })
              .addTo(mapRef.current)
              .bindPopup('<b>Your Live Location</b><br/>GPS signal active');
          }

          if (userAccuracyCircleRef.current) {
            userAccuracyCircleRef.current.setLatLng([latitude, longitude]);
            userAccuracyCircleRef.current.setRadius(accuracy);
          } else {
            userAccuracyCircleRef.current = LModule.circle([latitude, longitude], {
              radius: accuracy,
              color: '#38bdf8',
              fillColor: '#38bdf8',
              fillOpacity: 0.15,
            }).addTo(mapRef.current);
          }
        }

        setBins((prev) => {
          const userBinsExist = prev.some((b) => b.id.startsWith('BIN-USER'));
          if (userBinsExist) return prev;
          return [
            {
              id: 'BIN-USER-01',
              name: 'My Nearby Smart Bin (East)',
              lat: latitude + 0.0012,
              lng: longitude + 0.0015,
              fillLevel: 84,
              type: 'Recyclable',
              battery: 92,
              temp: 21.0,
              lastUpdated: 'Just now',
              status: 'Warning',
            },
            {
              id: 'BIN-USER-02',
              name: 'My Nearby Smart Bin (West)',
              lat: latitude - 0.001,
              lng: longitude - 0.0012,
              fillLevel: 35,
              type: 'General',
              battery: 97,
              temp: 20.8,
              lastUpdated: 'Just now',
              status: 'Normal',
            },
            ...prev,
          ];
        });

        addLog(
          `Real GPS position acquired: Lat ${latitude.toFixed(4)}, Lng ${longitude.toFixed(4)} (±${Math.round(
            accuracy
          )}m)`,
          'success'
        );
      },
      (err) => {
        setIsLocating(false);
        setLocationError(`GPS Location failed: ${err.message}`);
        addLog(`GPS location error: ${err.message}`, 'warn');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // 3. Render and Update Smart Bins on Map
  useEffect(() => {
    if (!mapRef.current || !leafletRef.current) return;
    const LModule = leafletRef.current;

    bins.forEach((bin) => {
      if (filterType !== 'All' && bin.type !== filterType && !(filterType === 'Critical' && bin.fillLevel >= 80)) {
        if (markersRef.current[bin.id]) {
          markersRef.current[bin.id].remove();
          delete markersRef.current[bin.id];
        }
        return;
      }

      const isCritical = bin.fillLevel >= 80;
      const isWarning = bin.fillLevel >= 65 && bin.fillLevel < 80;

      const badgeColor = isCritical
        ? 'bg-rose-600'
        : isWarning
        ? 'bg-amber-500'
        : bin.type === 'Recyclable'
        ? 'bg-emerald-600'
        : bin.type === 'Organic'
        ? 'bg-lime-600'
        : bin.type === 'E-Waste'
        ? 'bg-blue-600'
        : bin.type === 'Hazardous'
        ? 'bg-purple-600'
        : 'bg-slate-700';

      const ringColor = isCritical ? 'ring-rose-400/60 animate-pulse' : 'ring-emerald-400/40';

      const iconHtml = `
        <div class="relative group cursor-pointer flex flex-col items-center">
          <div class="px-2 py-1 rounded-2xl ${badgeColor} text-white shadow-xl flex items-center gap-1 font-black text-xs ring-4 ${ringColor} transition-transform hover:scale-125 border-2 border-white">
            <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18"/>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
              <line x1="10" y1="11" x2="10" y2="17"/>
              <line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
            <span class="text-[11px] font-black leading-none">${bin.fillLevel}%</span>
          </div>
          <span class="px-1.5 py-0.5 mt-0.5 rounded-md bg-slate-900 text-white font-extrabold text-[9px] shadow-sm whitespace-nowrap border border-slate-700">
            🗑️ ${bin.type}
          </span>
        </div>
      `;

      const binIcon = LModule.divIcon({
        className: `custom-bin-marker-${bin.id}`,
        html: iconHtml,
        iconSize: [60, 48],
        iconAnchor: [30, 24],
      });

      if (markersRef.current[bin.id]) {
        markersRef.current[bin.id].setLatLng([bin.lat, bin.lng]);
        markersRef.current[bin.id].setIcon(binIcon);
      } else {
        const marker = LModule.marker([bin.lat, bin.lng], { icon: binIcon })
          .addTo(mapRef.current!)
          .bindTooltip(`🗑️ ${bin.name} (${bin.fillLevel}% Full)`, { direction: 'top', offset: [0, -22] });

        marker.on('click', () => {
          setSelectedItem({ type: 'bin', data: bin });
          if (onBinSelect) onBinSelect(bin);
        });

        markersRef.current[bin.id] = marker;
      }
    });
  }, [bins, filterType, isLeafletReady]);

  // 4. Real-Time Moving Trucks Animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setTrucks((prevTrucks) =>
        prevTrucks.map((truck) => {
          const waypoints = truck.waypoints;
          if (!waypoints || waypoints.length === 0) return truck;

          const currentTargetIdx = (truck.currentWaypointIdx + 1) % waypoints.length;
          const targetCoord = waypoints[currentTargetIdx];
          const currLat = truck.lat;
          const currLng = truck.lng;

          const speedFactor = 0.00015;
          const dLat = targetCoord[0] - currLat;
          const dLng = targetCoord[1] - currLng;
          const dist = Math.sqrt(dLat * dLat + dLng * dLng);

          let newLat = currLat;
          let newLng = currLng;
          let nextIdx = truck.currentWaypointIdx;

          if (dist < 0.0002) {
            nextIdx = currentTargetIdx;
          } else {
            newLat += (dLat / dist) * speedFactor;
            newLng += (dLng / dist) * speedFactor;
          }

          return {
            ...truck,
            lat: newLat,
            lng: newLng,
            currentWaypointIdx: nextIdx,
          };
        })
      );

      if (Math.random() < 0.3) {
        setBins((prevBins) => {
          const randomIndex = Math.floor(Math.random() * prevBins.length);
          const targetBin = prevBins[randomIndex];
          if (!targetBin) return prevBins;

          const fillDelta = Math.random() > 0.4 ? 1 : -2;
          const newFill = Math.min(100, Math.max(5, targetBin.fillLevel + fillDelta));

          if (newFill >= 85 && targetBin.fillLevel < 85) {
            addLog(`OVERFLOW WARNING: ${targetBin.name} fill reached ${newFill}%`, 'warn');
          }

          const updated = [...prevBins];
          updated[randomIndex] = {
            ...targetBin,
            fillLevel: newFill,
            status: newFill >= 80 ? 'Critical' : newFill >= 65 ? 'Warning' : 'Normal',
            lastUpdated: 'Just now',
          };
          return updated;
        });
      }
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  // 5. Update Truck Markers on Map
  useEffect(() => {
    if (!mapRef.current || !leafletRef.current) return;
    const LModule = leafletRef.current;

    trucks.forEach((truck) => {
      const truckIconHtml = `
        <div class="relative group cursor-pointer">
          <div class="w-10 h-10 rounded-2xl bg-slate-900 text-emerald-400 shadow-xl border-2 border-emerald-500 flex items-center justify-center font-bold text-xs transition-transform hover:scale-110">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
              <path d="M15 18H9"/>
              <path d="M19 18h2a1 1 0 0 0 1-1v-5l-3-4h-5v10Z"/>
              <circle cx="7" cy="18" r="2"/>
              <circle cx="17" cy="18" r="2"/>
            </svg>
          </div>
          <span class="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-md bg-emerald-500 text-white font-extrabold text-[9px] shadow-xs">
            ${truck.speedKmH}km/h
          </span>
        </div>
      `;

      const truckIcon = LModule.divIcon({
        className: `custom-truck-marker-${truck.id}`,
        html: truckIconHtml,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      if (truckMarkersRef.current[truck.id]) {
        truckMarkersRef.current[truck.id].setLatLng([truck.lat, truck.lng]);
        truckMarkersRef.current[truck.id].setIcon(truckIcon);
      } else {
        const marker = LModule.marker([truck.lat, truck.lng], { icon: truckIcon })
          .addTo(mapRef.current!)
          .bindTooltip(`🚛 EV Fleet: ${truck.id} (${truck.driver})`, { direction: 'top', offset: [0, -18] });
        marker.on('click', () => {
          setSelectedItem({ type: 'truck', data: truck });
        });
        truckMarkersRef.current[truck.id] = marker;
      }
    });
  }, [trucks, isLeafletReady]);

  // Preset City Jump
  const handleCityChange = (city: (typeof CITY_PRESETS)[0]) => {
    setCenterCoords({ lat: city.lat, lng: city.lng });
    if (mapRef.current) {
      mapRef.current.flyTo([city.lat, city.lng], 14, { animate: true, duration: 1.2 });
    }
    setBins([
      {
        id: `BIN-CITY-01`,
        name: `${city.name.split(',')[0]} Central Station`,
        lat: city.lat + 0.002,
        lng: city.lng + 0.003,
        fillLevel: 87,
        type: 'Recyclable',
        battery: 95,
        temp: 21.0,
        lastUpdated: 'Just now',
        status: 'Critical',
      },
      {
        id: `BIN-CITY-02`,
        name: `${city.name.split(',')[0]} North Hub`,
        lat: city.lat - 0.003,
        lng: city.lng - 0.002,
        fillLevel: 42,
        type: 'General',
        battery: 88,
        temp: 20.4,
        lastUpdated: 'Just now',
        status: 'Normal',
      },
      {
        id: `BIN-CITY-03`,
        name: `${city.name.split(',')[0]} Eco Compost`,
        lat: city.lat + 0.004,
        lng: city.lng - 0.004,
        fillLevel: 94,
        type: 'Organic',
        battery: 79,
        temp: 23.5,
        lastUpdated: 'Just now',
        status: 'Critical',
      },
    ]);
    addLog(`Map re-centered to ${city.name}`, 'info');
  };

  return (
    <div className="space-y-4">
      {/* Map Control Bar */}
      <div className="bg-white p-4 rounded-3xl border border-gray-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Left: Location & GPS controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleRequestUserLocation}
            disabled={isLocating}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs ${
              userLocation
                ? 'bg-sky-600 text-white hover:bg-sky-700 ring-2 ring-sky-300'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Acquiring GPS...' : userLocation ? 'Track Live Location ✓' : 'Use My GPS Location'}</span>
          </button>

          {/* City Preset Selector */}
          <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl">
            <MapPin className="w-3.5 h-3.5 text-gray-500 ml-2" />
            <select
              onChange={(e) => {
                const found = CITY_PRESETS.find((c) => c.name === e.target.value);
                if (found) handleCityChange(found);
              }}
              className="bg-transparent text-xs font-semibold text-gray-800 pr-3 py-1 focus:outline-hidden cursor-pointer"
            >
              {CITY_PRESETS.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Middle: Bin Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {['All', 'Critical', 'Recyclable', 'General', 'Organic', 'E-Waste', 'Hazardous'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                filterType === t
                  ? 'bg-gray-900 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t === 'Critical' ? '⚠️ Critical' : t}
            </button>
          ))}
        </div>

        {/* Right: Add Bin Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddMode(!isAddMode)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isAddMode
                ? 'bg-amber-500 text-white animate-bounce'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAddMode ? 'Click Map to Place Bin' : 'Deploy IoT Bin'}</span>
          </button>
        </div>
      </div>

      {locationError && (
        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{locationError}</span>
        </div>
      )}

      {/* Main Grid: Leaflet Map (Left) + Live Telemetry & Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Leaflet Map Canvas */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-200/80 p-2 shadow-xs relative overflow-hidden flex flex-col min-h-[520px]">
          {/* Top Floating Status Indicator */}
          <div className="absolute top-5 left-5 z-10 bg-slate-900/90 backdrop-blur-md text-white px-4 py-2 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold tracking-wide">LIVE GPS SATELLITE FEED</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              Bins: {bins.length} | EV Fleet: {trucks.length}
            </span>
          </div>

          {/* Leaflet Map Div */}
          <div ref={mapContainerRef} className="w-full h-full min-h-[500px] rounded-2xl z-0" />
        </div>

        {/* Right Inspector & Telemetry Log */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Selected Item Telemetry Details Card */}
          {selectedItem ? (
            <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {selectedItem.type === 'bin' ? 'IoT Bin Telemetry' : 'EV Truck GPS'}
                </span>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-xs text-gray-400 hover:text-gray-700 font-bold"
                >
                  Close ✕
                </button>
              </div>

              {selectedItem.type === 'bin' ? (
                <>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{selectedItem.data.name}</h3>
                    <p className="text-xs text-gray-500 font-mono">ID: {selectedItem.data.id}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                      <span className="text-[11px] font-semibold text-gray-500">Fill Level</span>
                      <p className="text-xl font-black text-gray-900 mt-0.5">
                        {selectedItem.data.fillLevel}%
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                        <div
                          className={`h-1.5 rounded-full ${
                            selectedItem.data.fillLevel >= 80 ? 'bg-red-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${selectedItem.data.fillLevel}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                      <span className="text-[11px] font-semibold text-gray-500">Battery & Sensor</span>
                      <p className="text-xl font-black text-emerald-700 mt-0.5">
                        {selectedItem.data.battery}%
                      </p>
                      <span className="text-[10px] text-gray-400 font-medium">Li-Ion Solar IoT</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                      <span className="text-[11px] font-semibold text-gray-500">Waste Stream</span>
                      <p className="text-xs font-bold text-gray-900 mt-1">{selectedItem.data.type}</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                      <span className="text-[11px] font-semibold text-gray-500">Coordinates</span>
                      <p className="text-[10px] font-mono text-gray-700 mt-1 truncate">
                        {selectedItem.data.lat.toFixed(4)}, {selectedItem.data.lng.toFixed(4)}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{selectedItem.data.id}</h3>
                    <p className="text-xs text-gray-500 font-medium">Driver: {selectedItem.data.driver}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-2xl bg-slate-900 text-white">
                      <span className="text-[10px] font-semibold text-slate-400">Current Speed</span>
                      <p className="text-xl font-black text-emerald-400 mt-0.5">
                        {selectedItem.data.speedKmH} km/h
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                      <span className="text-[11px] font-semibold text-gray-500">EV Battery</span>
                      <p className="text-xl font-black text-emerald-700 mt-0.5">
                        {selectedItem.data.batteryPercent}%
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 col-span-2">
                      <span className="text-[11px] font-semibold text-gray-500">Payload Load</span>
                      <p className="text-sm font-bold text-gray-900 mt-0.5">
                        {selectedItem.data.currentPayloadKg} / {selectedItem.data.capacityKg} kg
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-emerald-900 to-teal-950 p-6 rounded-3xl text-white shadow-lg relative overflow-hidden">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-bold tracking-wide">Real-Time GIS Inspector</h4>
                  <p className="text-[11px] text-emerald-300/80">Click any bin or vehicle on map</p>
                </div>
              </div>
              <p className="text-xs text-emerald-100/70 leading-relaxed">
                Click on any waste bin marker or live collection vehicle on the map to inspect real-time sensor fill levels, battery stats, GPS speed, and coordinates.
              </p>
            </div>
          )}

          {/* Live Telemetry Event Stream Console */}
          <div className="bg-slate-900 p-5 rounded-3xl text-slate-100 shadow-md flex-1 flex flex-col min-h-[220px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="text-xs font-bold tracking-wider text-slate-200">GPS TELEMETRY STREAM</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs font-mono max-h-[240px]">
              {liveLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-2 leading-tight">
                  <span className="text-[10px] text-slate-500 shrink-0">{log.time}</span>
                  <span
                    className={`${
                      log.type === 'warn'
                        ? 'text-amber-400 font-bold'
                        : log.type === 'success'
                        ? 'text-emerald-400'
                        : 'text-slate-300'
                    }`}
                  >
                    {log.msg}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
