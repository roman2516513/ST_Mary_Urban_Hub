import { travelModes } from '../data/travelModes';

export function getMode(modeId) {
  return travelModes.find((mode) => mode.id === modeId) || travelModes[0];
}

export function estimateJourney(distanceKm, modeId) {
  const distance = Number(distanceKm) || 0;
  const mode = getMode(modeId);

  return {
    mode,
    distance,
    cost: +(distance * mode.costPerKm).toFixed(2),
    time: Math.max(1, Math.round(distance * mode.minutesPerKm)),
    carbon: Math.round(distance * mode.carbonPerKm),
    convenience: mode.convenience
  };
}

export function getRecommendation(a, b) {
  if (a.carbon < b.carbon && a.time <= b.time + 8) return `${a.mode.name} is the greener practical option.`;
  if (a.time < b.time) return `${a.mode.name} is faster for this journey.`;
  if (a.cost < b.cost) return `${a.mode.name} is cheaper for this journey.`;
  return `${b.mode.name} may be the more balanced choice.`;
}

export function formatMoney(value) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(value || 0);
}

