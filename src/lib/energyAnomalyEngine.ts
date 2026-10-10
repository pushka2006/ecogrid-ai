import { EnergyHourlyReading, BuildingEnergy } from './types';

export interface TariffRates {
  peakRateINR: number; // e.g. ₹9.50 per kWh (6 PM - 10 PM)
  standardRateINR: number; // e.g. ₹6.50 per kWh (6 AM - 6 PM)
  offPeakRateINR: number; // e.g. ₹4.20 per kWh (10 PM - 6 AM)
  carbonFactorKgPerKwh: number; // 0.82 kg CO2 per kWh grid average (India CEA)
}

export const DEFAULT_TARIFFS: TariffRates = {
  peakRateINR: 9.5,
  standardRateINR: 6.5,
  offPeakRateINR: 4.2,
  carbonFactorKgPerKwh: 0.82,
};

/**
 * Baseline Anomaly Detector:
 * Computes percentage deviations and flags points exceeding threshold (e.g. > 25% above baseline).
 */
export function detectEnergyAnomalies(
  readings: EnergyHourlyReading[],
  thresholdPercent = 25
): EnergyHourlyReading[] {
  return readings.map(r => {
    const deviation = ((r.todayKwh - r.yesterdayKwh) / r.yesterdayKwh) * 100;
    const isAnomaly = deviation >= thresholdPercent;
    return {
      ...r,
      isAnomaly,
      anomalyPercent: isAnomaly ? Math.round(deviation) : undefined,
      anomalyNote: isAnomaly
        ? `Abnormal spike of +${Math.round(deviation)}% detected compared to baseline.`
        : undefined,
    };
  });
}

/**
 * Calculates estimated cost & potential savings for buildings.
 */
export function calculateBuildingSavings(
  buildings: BuildingEnergy[],
  tariffs = DEFAULT_TARIFFS
): { totalCostINR: number; totalPotentialSavingsINR: number; co2AvoidableKg: number } {
  let totalCostINR = 0;
  let totalPotentialSavingsINR = 0;

  for (const b of buildings) {
    totalCostINR += b.tariffCostINR;
    totalPotentialSavingsINR += b.potentialSavingsINR;
  }

  const kwhSaved = totalPotentialSavingsINR / tariffs.standardRateINR;
  const co2AvoidableKg = kwhSaved * tariffs.carbonFactorKgPerKwh;

  return {
    totalCostINR: Math.round(totalCostINR),
    totalPotentialSavingsINR: Math.round(totalPotentialSavingsINR),
    co2AvoidableKg: Math.round(co2AvoidableKg),
  };
}

/**
 * Parse uploaded CSV smart-meter readings.
 * Supports format: Hour,TodayKwh,YesterdayKwh or Timestamp,Building,kWh
 */
export function parseEnergyCsv(csvText: string): EnergyHourlyReading[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const results: EnergyHourlyReading[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.trim());
    if (cols.length < 2) continue;

    const hour = cols[0] || `${i * 2}:00`;
    const todayKwh = parseFloat(cols[1]) || 50;
    const yesterdayKwh = cols[2] ? parseFloat(cols[2]) : todayKwh * 0.9;

    results.push({
      hour,
      todayKwh,
      yesterdayKwh,
    });
  }

  return detectEnergyAnomalies(results);
}
