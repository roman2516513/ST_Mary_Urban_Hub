// Carbon footprint calculations / helper utilities

export const calculateCarbonEmissions = (travelMode, distance) => {
  const emissionsFactors = {
    bus: 89,
    tube: 41,
    rail: 14,
    cycling: 0,
    walking: 0,
    car: 192
  };

  const factor = emissionsFactors[travelMode] || 0;
  return distance * factor;
};

export const formatCarbonReduction = (savings) => {
  if (savings >= 1000) {
    return `${(savings / 1000).toFixed(2)} kg`;
  }
  return `${Math.round(savings)} g`;
};
