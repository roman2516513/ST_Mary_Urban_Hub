export const travelModes = [
  {
    id: 'tube',
    name: 'Tube',
    icon: 'bi-train-front',
    benefit: 'Fast across central London and easy to combine with walking.',
    limitation: 'Can be crowded and affected by line disruptions.',
    costPerKm: 0.52,
    minutesPerKm: 2.2,
    carbonPerKm: 35,
    convenience: 8
  },
  {
    id: 'bus',
    name: 'Bus',
    icon: 'bi-bus-front',
    benefit: 'Affordable, wide coverage and better for short local journeys.',
    limitation: 'Traffic can make journey times unpredictable.',
    costPerKm: 0.28,
    minutesPerKm: 4.5,
    carbonPerKm: 82,
    convenience: 7
  },
  {
    id: 'rail',
    name: 'Rail',
    icon: 'bi-sign-railroad',
    benefit: 'Strong for longer journeys and commuter routes.',
    limitation: 'Less flexible for short local trips.',
    costPerKm: 0.45,
    minutesPerKm: 2.6,
    carbonPerKm: 41,
    convenience: 7
  },
  {
    id: 'cycle',
    name: 'Cycling',
    icon: 'bi-bicycle',
    benefit: 'Low-cost, healthy and zero direct emissions.',
    limitation: 'Weather, safety confidence and bike availability matter.',
    costPerKm: 0.04,
    minutesPerKm: 3.8,
    carbonPerKm: 0,
    convenience: 6
  },
  {
    id: 'walk',
    name: 'Walking',
    icon: 'bi-person-walking',
    benefit: 'Free, accessible for short trips and supports wellbeing.',
    limitation: 'Slow for longer distances and affected by weather.',
    costPerKm: 0,
    minutesPerKm: 12,
    carbonPerKm: 0,
    convenience: 5
  }
];
