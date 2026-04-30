const BASE_URL = 'https://api.tfl.gov.uk';

function withKey(path) {
  const key = import.meta.env.VITE_TFL_APP_KEY;
  if (!key) return `${BASE_URL}${path}`;
  const joiner = path.includes('?') ? '&' : '?';
  return `${BASE_URL}${path}${joiner}app_key=${key}`;
}

async function request(path) {
  const response = await fetch(withKey(path));
  if (!response.ok) {
    throw new Error(`TfL request failed: ${response.status}`);
  }
  return response.json();
}

export function getLineStatuses() {
  return request('/Line/Mode/tube,dlr,overground,elizabeth-line/Status');
}

export function planJourney(from, to) {
  const start = encodeURIComponent(from.trim());
  const end = encodeURIComponent(to.trim());
  return request(`/Journey/JourneyResults/${start}/to/${end}?journeyPreference=LeastTime&timeIs=Departing`);
}

export function getNearbyStops(lat, lon) {
  return request(`/StopPoint?lat=${lat}&lon=${lon}&stopTypes=NaptanMetroStation,NaptanRailStation,NaptanPublicBusCoachTram&radius=900`);
}

export function searchBikePoints(query) {
  return request(`/BikePoint/Search?query=${encodeURIComponent(query.trim())}`);
}

export function getBikePoint(id) {
  return request(`/BikePoint/${encodeURIComponent(id)}`);
}

export function propertyValue(place, key) {
  const item = place?.additionalProperties?.find((property) => property.key === key);
  return item?.value || '0';
}
