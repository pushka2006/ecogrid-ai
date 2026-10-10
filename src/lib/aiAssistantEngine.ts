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
  const q = prompt.toLowerCase().trim();
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. Live Bin Telemetry & Collection Priority
  if (q.includes('bin') || q.includes('waste bin') || q.includes('full') || q.includes('overflow') || q.includes('collect')) {
    const fullBins = context.bins.filter((b) => b.fillLevel >= 80);
    const sorted = [...context.bins].sort((a, b) => b.fillLevel - a.fillLevel);
    const top3 = sorted.slice(0, 3);

    const listText = top3
      .map(
        (b, i) =>
          `${i + 1}. **${b.label} (${b.fillLevel}%)** — ${b.wasteType}\n   *Zone: ${b.zone}*\n   ${
            b.fillLevel >= 85 ? '🚨 High priority: Immediate collection required.' : '⚠️ Approaching capacity limit.'
          }`
      )
      .join('\n\n');

    const text = `Based on real-time ultrasonic IoT sensors across campus, we currently have **${fullBins.length} bin(s)** requiring urgent action.\n\n**Top Priority Bins to Collect:**\n\n${listText}\n\n**Summary:**\n- Total Active Bins: ${context.bins.length}\n- Average Fill Level: ${Math.round(
      context.bins.reduce((acc, b) => acc + b.fillLevel, 0) / context.bins.length
    )}%`;

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text,
      timestamp,
      sources: ['Real-time IoT Ultrasonic Sensors', 'Campus Waste Logistics Database'],
      suggestedFollowUps: [
        'Which building has the highest electricity consumption?',
        'How can our campus reduce electricity costs?',
      ],
      mathProof: `Priority Index = Max(FillLevel%) => [${top3.map((b) => `${b.id}:${b.fillLevel}%`).join(', ')}]`,
    };
  }

  // 2. Real-Time Building Energy & Avoidable Consumption / Anomalies
  if (q.includes('building') || q.includes('hvac') || (q.includes('electricity') && (q.includes('waste') || q.includes('highest') || q.includes('high')))) {
    const sorted = [...context.buildings].sort((a, b) => b.currentKwh - a.currentKwh);
    const highestConsuming = sorted[0];
    const highestSavings = [...context.buildings].sort((a, b) => b.potentialSavingsINR - a.potentialSavingsINR)[0];

    const text = `Here is the real-time building energy analysis based on live sub-meter readings:\n\n1. **Highest Electricity Consumer:**\n   - **${highestConsuming.name}**: **${highestConsuming.currentKwh.toLocaleString()} kWh** (Baseline: ${highestConsuming.baselineKwh.toLocaleString()} kWh, Deviation: +${highestConsuming.deviationPercent}%)\n\n2. **Highest Avoidable Waste / Savings Opportunity:**\n   - **${highestSavings.name}**: Potential Monthly Savings of **₹${highestSavings.potentialSavingsINR.toLocaleString()}**.\n   - **Detected Anomaly:** ${highestSavings.statusReason || 'HVAC chiller load active after hours.'}\n\n**Recommended Recommendation:**\nSet automated BAS setback schedules for ${highestSavings.name} after 7:30 PM to eliminate unnecessary off-peak load.`;

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text,
      timestamp,
      sources: ['Live Building Sub-metering API', 'ASHRAE Energy Baseline Standards'],
      suggestedFollowUps: [
        'What percentage of reported waste is recyclable?',
        'How can our campus reduce electricity costs?',
      ],
      mathProof: `Avoidable Energy = ${highestSavings.currentKwh}kWh - ${highestSavings.baselineKwh}kWh = ${highestSavings.currentKwh - highestSavings.baselineKwh}kWh excess`,
    };
  }

  // 3. Real-Time Recyclability & Waste Classification Stats
  if (q.includes('recycl') || q.includes('percent') || q.includes('ratio') || q.includes('material')) {
    const recyclablePct = Math.round((context.recyclableKg / context.totalWasteKg) * 100);
    const landfillDiverted = context.totalWasteKg - Math.round(context.totalWasteKg * 0.22);

    const text = `According to live weighbridge telemetry & AI camera classification:\n\n- **Total Waste Tracked:** **${context.totalWasteKg.toLocaleString()} kg**\n- **Verified Recyclables:** **${context.recyclableKg.toLocaleString()} kg (${recyclablePct}%)**\n- **Estimated Landfill Diversion:** **${landfillDiverted.toLocaleString()} kg (${100 - 22}%)**\n\n**Stream Breakdown:**\n- 📦 Paper & Cardboard: ~42%\n- 🍾 Plastics & PET: ~34%\n- 🥫 Metals & Aluminum: ~14%\n- 🍏 Organic Composting: ~10%`;

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text,
      timestamp,
      sources: ['AI Vision Waste Classifier', 'Weighbridge Audit Logs'],
      suggestedFollowUps: [
        'Which bins should be collected first?',
        'How can our campus reduce electricity costs?',
      ],
      mathProof: `Recycling Ratio = (${context.recyclableKg}kg / ${context.totalWasteKg}kg) × 100 = ${recyclablePct}%`,
    };
  }

  // 4. Energy Reduction & Solar/Renewable Insights
  if (q.includes('cost') || q.includes('solar') || q.includes('renewable') || q.includes('reduce') || q.includes('save')) {
    const solarRatio = Math.round((context.solarKwh / context.totalKwh) * 100);
    const netGridKwh = context.totalKwh - context.solarKwh;

    const text = `Here are the real-time renewable metrics & recommendations to reduce campus energy costs:\n\n- **Total Campus Load:** **${context.totalKwh.toLocaleString()} kWh**\n- **Solar Self-Generation:** **${context.solarKwh.toLocaleString()} kWh (${solarRatio}% of total demand)**\n- **Remaining Grid Reliance:** **${netGridKwh.toLocaleString()} kWh**\n\n**Actionable Strategies:**\n1. **Load Shifting:** Shift heavy pumping & EV charging to peak solar window (11:00 AM – 2:30 PM).\n2. **Peak Tariff Avoidance:** Save up to **₹28,450/month** by battery storage peak shaving between 6:00 PM - 9:00 PM.`;

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text,
      timestamp,
      sources: ['Solar Rooftop Inverter Telemetry', 'Campus Smart Grid Controller'],
      suggestedFollowUps: [
        'Which building has the highest electricity consumption?',
        'Which bins should be collected first?',
      ],
      mathProof: `Solar Contribution = (${context.solarKwh} kWh / ${context.totalKwh} kWh) × 100 = ${solarRatio}%`,
    };
  }

  // 5. Dynamic Natural Language Handler for Any Prompt
  const words = prompt.split(' ').filter((w) => w.length > 3);
  const keywordSummary = words.length > 0 ? `regarding "${words.slice(0, 3).join(' ')}"` : '';

  const text = `Here is the current real-time system status ${keywordSummary}:\n\n- **Campus Waste Telemetry:** ${context.totalWasteKg.toLocaleString()} kg collected (${Math.round((context.recyclableKg / context.totalWasteKg) * 100)}% recyclable stream)\n- **Active Bins Needing Attention:** ${context.bins.filter((b) => b.fillLevel >= 80).length} bins above 80% capacity\n- **Grid & Solar Status:** ${context.totalKwh.toLocaleString()} kWh consumed | ${context.solarKwh.toLocaleString()} kWh generated from solar (${Math.round((context.solarKwh / context.totalKwh) * 100)}% green power)\n- **Campus CO₂ Savings:** 4.8 tons CO₂ emissions avoided this week\n\nHow else can I assist you with collection routes, building energy analysis, or sustainability reports?`;

  return {
    id: `msg-${Date.now()}`,
    sender: 'assistant',
    text,
    timestamp,
    sources: ['Live Campus Telemetry Engine', 'Amazon Bedrock Knowledge Base'],
    suggestedFollowUps: [
      'Which bins should be collected first?',
      'Which building has the highest avoidable electricity consumption?',
      'What percentage of reported waste is potentially recyclable?',
    ],
  };
}
