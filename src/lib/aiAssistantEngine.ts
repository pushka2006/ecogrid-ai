import { SmartBin, BuildingEnergy, ChatMessage } from './types';

/**
 * Grounded AI Sustainability Assistant Engine
 * Emulates Amazon Bedrock (Claude 3.5 Sonnet / Amazon Titan) retrieval augmented generation
 * backed by live platform telemetry, IoT bin state, and tariff calculations.
 */
export function queryAiAssistant(
  prompt: string,
  context: {
    bins: SmartBin[];
    buildings: BuildingEnergy[];
    totalWasteKg: number;
    recyclableKg: number;
    totalKwh: number;
    solarKwh: number;
  }
): ChatMessage {
  const q = prompt.toLowerCase();
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. "Which bins should be collected first?"
  if (q.includes('bin') && (q.includes('collect') || q.includes('first') || q.includes('priority'))) {
    const sorted = [...context.bins].sort((a, b) => b.fillLevel - a.fillLevel).slice(0, 3);
    const text = `Based on current fill levels and urgency, here are the top 3 bins to collect:

1. **${sorted[0]?.label || 'Bin B-12'} (${sorted[0]?.fillLevel || 92}%)** — ${sorted[0]?.wasteType || 'Plastic & General'}
   *Located at ${sorted[0]?.zone || 'North Block'}*
   High priority due to near-full level.

2. **${sorted[1]?.label || 'Bin B-07'} (${sorted[1]?.fillLevel || 88}%)** — ${sorted[1]?.wasteType || 'Paper'}
   *Located at ${sorted[1]?.zone || 'Academic Zone'}*
   Expected to be full within 6 hours.

3. **${sorted[2]?.label || 'Bin B-03'} (${sorted[2]?.fillLevel || 76}%)** — ${sorted[2]?.wasteType || 'Organic'}
   *Located at ${sorted[2]?.zone || 'Hostel Area'}*
   High organic waste accumulation.

Collecting these first will help prevent overflow and reduce odor and contamination risks.`;

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text,
      timestamp,
      sources: ['Bin telemetry data', 'Campus collection rules', 'Ultrasonic sensor logs'],
      suggestedFollowUps: [
        'Which building has the highest avoidable electricity consumption?',
        'How much diesel does route optimization save?',
      ],
      mathProof: 'Priority Score = 0.5×(Fill%) + 0.3×(UrgencyWeight) + 0.2×(OdorRiskIndex)',
    };
  }

  // 2. "Which building has the highest avoidable electricity consumption?"
  if (q.includes('building') || (q.includes('energy') && (q.includes('waste') || q.includes('avoidable') || q.includes('highest')))) {
    const highestWasteBld = [...context.buildings].sort((a, b) => b.potentialSavingsINR - a.potentialSavingsINR)[0];
    const text = `**${highestWasteBld.name}** has the highest avoidable electricity consumption:

- **Current Consumption:** ${highestWasteBld.currentKwh.toLocaleString()} kWh (Baseline: ${highestWasteBld.baselineKwh.toLocaleString()} kWh)
- **Deviation:** +${highestWasteBld.deviationPercent}% above historical baseline
- **Identified Anomaly:** Chiller loop #2 active after 8:00 PM without thermal load
- **Potential Monthly Savings:** **₹${highestWasteBld.potentialSavingsINR.toLocaleString()}** (approx. ${Math.round(highestWasteBld.potentialSavingsINR / 7.5)} kWh saved)
- **Recommended Action:** Automate BAS (Building Automation System) setback schedule and raise server room setpoint from 19°C to 22°C.`;

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text,
      timestamp,
      sources: ['Smart-meter sub-metering logs', 'ASHRAE Standard 90.1 energy baselines', 'Tariff schedule v2.4'],
      suggestedFollowUps: [
        'Can we shift HVAC pre-cooling to solar peak hours?',
        'What is our total campus carbon footprint this week?',
      ],
      mathProof: 'Avoidable Cost = (Actual_kWh - Baseline_kWh) × Peak_Tariff(₹9.50/kWh)',
    };
  }

  // 3. "What percentage of reported waste is potentially recyclable?"
  if (q.includes('percent') || q.includes('percentage') || (q.includes('waste') && q.includes('recyclable'))) {
    const rate = ((context.recyclableKg / context.totalWasteKg) * 100).toFixed(1);
    const text = `Currently, **${rate}%** (${context.recyclableKg.toLocaleString()} kg out of ${context.totalWasteKg.toLocaleString()} kg total waste) is verified potentially recyclable.

**Material Breakdown:**
- **Plastics (PET / HDPE):** 34% of recyclable stream (Blue Bins)
- **Fiber & Cardboard:** 42% (Yellow Bins)
- **Metals & Aluminum:** 14% (Green Bins)
- **Glass Containers:** 10% (Amber Bins)

*Note:* Organic waste (${Math.round(context.totalWasteKg * 0.24)} kg) is diverted separately to the campus on-site aerobic composter, achieving a total landfill diversion rate of **77.1%**.`;

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text,
      timestamp,
      sources: ['Verified campus weighbridge logs', 'Automated CV classification pipeline', 'S3 Audit bucket'],
      suggestedFollowUps: [
        'How can we improve contamination rates in Hostel Bins?',
        'Export verified waste manifest as CSV',
      ],
      mathProof: 'Recyclability Rate = (Recyclable_Kg / Total_Kg) × 100',
    };
  }

  // 4. "How can our campus reduce electricity costs?"
  if (q.includes('reduce') || q.includes('cost') || q.includes('save money')) {
    const text = `Here are the top 3 high-impact strategies to lower campus electricity costs:

1. **Load Shifting to Solar Peak (11:00 AM – 2:30 PM):**
   - Shift central water pumps and EV fleet charging to midday when solar generation exceeds campus base load.
   - Saves approx. **₹12,400/month** by avoiding grid peak tariff penalties.

2. **Automated HVAC Setback in Building B:**
   - Terminate after-hours air handling unit cooling cycles at 7:00 PM.
   - Saves **₹6,200/month** and eliminates the 8 PM 110 kWh spike.

3. **Power Factor Correction in Academic Quad:**
   - Optimize capacitor banks to raise power factor from 0.88 to 0.98.
   - Prevents kVAh reactive power penalties.`;

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text,
      timestamp,
      sources: ['Building energy load profiles', 'State Electricity Regulatory Commission (SERC) tariff model', 'Amazon Bedrock Energy Optimizer'],
      suggestedFollowUps: [
        'Show me the renewable utilization breakdown',
        'Which bins should be collected first?',
      ],
      mathProof: 'Net Monthly Savings = Σ (KWh_shifted × (PeakRate - OffPeakRate)) + Σ SetbackSavings',
    };
  }

  // Generic grounded fallback
  return {
    id: `msg-${Date.now()}`,
    sender: 'assistant',
    text: `Based on EcoGrid AI's live campus telemetry:

- **Waste Stream:** ${context.totalWasteKg.toLocaleString()} kg collected, ${context.recyclableKg.toLocaleString()} kg recycled (68% recyclable rate).
- **Energy Demand:** ${context.totalKwh.toLocaleString()} kWh consumed, ${context.solarKwh.toLocaleString()} kWh solar generated (48% renewable utilization).
- **Carbon Impact:** 4.8 tons CO₂ avoided this week.

You can ask me to run collection route optimization, analyze building energy spikes, or export verified compliance reports.`,
    timestamp,
    sources: ['Amazon Bedrock Titan / Claude 3.5 Grounded Knowledge Base', 'Campus IoT Telemetry Feed'],
    suggestedFollowUps: [
      'Which bins should be collected first?',
      'Which building has the highest avoidable electricity consumption?',
      'What percentage of reported waste is potentially recyclable?',
    ],
  };
}
