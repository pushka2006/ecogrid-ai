export type WasteCategory =
  | 'Plastic'
  | 'Paper'
  | 'Cardboard'
  | 'Metal'
  | 'Glass'
  | 'Organic'
  | 'General'
  | 'E-Waste';

export interface WasteClassificationResult {
  id: string;
  category: WasteCategory;
  confidence: number;
  recyclableStatus: 'Recyclable' | 'Compost' | 'Special Handling' | 'Landfill';
  disposalGuidance: string;
  co2SavingsKg: number;
  weightKg: number;
  timestamp: string;
  imageUrl?: string;
  source: 'AWS Rekognition' | 'Amazon Bedrock Vision' | 'Local Edge CV' | 'Manual Verified';
  materialComposition: { material: string; percentage: number }[];
  isAmbiguous?: boolean;
}

export interface SmartBin {
  id: string;
  label: string; // e.g. "Bin #B-12"
  zone: string; // e.g. "North Block", "Academic Zone", "Hostel Area"
  wasteType: string; // e.g. "Plastic & General", "Paper", "Organic"
  fillLevel: number; // 0 - 100%
  status: 'Normal' | 'Warning' | 'Full';
  batteryPercent: number;
  temperatureC: number;
  lastPing: string;
  coords: { x: number; y: number; lat: number; lng: number };
  capacityLiters: number;
  estimatedWeightKg: number;
  urgentNeedsCollection: boolean;
}

export interface CollectionRoute {
  id: string;
  vehicleName: string;
  vehicleCapacityKg: number;
  assignedDriver: string;
  status: 'Scheduled' | 'In-Progress' | 'Completed';
  optimizedDistanceKm: number;
  baselineDistanceKm: number;
  optimizedTimeMin: number;
  baselineTimeMin: number;
  fuelSavedLiters: number;
  co2AvoidedKg: number;
  stops: {
    stopNumber: number;
    binId: string;
    locationName: string;
    fillLevel: number;
    wasteType: string;
    estimatedKg: number;
    status: 'Pending' | 'Collected' | 'Skipped';
  }[];
}

export interface EnergyHourlyReading {
  hour: string; // "12 AM", "4 AM", etc.
  todayKwh: number;
  yesterdayKwh: number;
  isAnomaly?: boolean;
  anomalyPercent?: number;
  anomalyNote?: string;
}

export interface BuildingEnergy {
  id: string;
  name: string;
  areaSqM: number;
  currentKwh: number;
  baselineKwh: number;
  deviationPercent: number;
  tariffCostINR: number;
  potentialSavingsINR: number;
  status: 'Optimal' | 'Warning' | 'High Waste';
  peakDemandKw: number;
  recommendation: string;
}

export interface RenewableDaily {
  day: string; // "Mon", "Tue", ...
  solarGenerationKwh: number;
  gridConsumptionKwh: number;
  batteryDischargeKwh: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sources?: string[];
  suggestedFollowUps?: string[];
  mathProof?: string;
}

export interface SystemAlert {
  id: string;
  title: string;
  subtitle: string;
  timeAgo: string;
  type: 'full' | 'spike' | 'completed' | 'report';
  color: 'red' | 'amber' | 'green' | 'blue';
  read: boolean;
  actionRoute?: string;
}

export type UserRole = 'Admin' | 'Facility Manager' | 'Collection Team' | 'Analyst';
