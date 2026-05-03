const BASE_URL = 'https://api.tfl.gov.uk';

function withKey(path) {
  const key = import.meta.env.VITE_TFL_APP_KEY;
  const id = import.meta.env.VITE_TFL_APP_ID;
  if (!key && !id) return `${BASE_URL}${path}`;
  const joiner = path.includes('?') ? '&' : '?';
  const parts = [];
  if (id) parts.push(`app_id=${encodeURIComponent(id)}`);
  if (key) parts.push(`app_key=${encodeURIComponent(key)}`);
  return `${BASE_URL}${path}${joiner}${parts.join('&')}`;
}

async function request(path) {
  const response = await fetch(withKey(path));
  const text = await response.text();
  if (!response.ok) {
    let body;
    try { body = JSON.parse(text); } catch { body = text; }
    // Allow 300 (disambiguation) responses to be handled by callers
    if (response.status === 300) {
      return body;
    }
    throw new Error(`TfL request failed: ${response.status} ${response.statusText} - ${typeof body === 'string' ? body : JSON.stringify(body)}`);
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export function getLineStatuses() {
  return request('/Line/Mode/tube,dlr,overground,elizabeth-line/Status');
}

export function planJourney(from, to) {
  const start = encodeURIComponent(from.trim());
  const end = encodeURIComponent(to.trim());
  return (async () => {
    let startVal = start;
    let endVal = end;
    let last;
    // Follow disambiguation hints up to 4 attempts
    for (let i = 0; i < 4; i++) {
      const path = `/Journey/JourneyResults/${startVal}/to/${endVal}?journeyPreference=LeastTime&timeIs=Departing`;
      last = await request(path);
      if (last?.journeys) return last;
      const toOpt = last?.toLocationDisambiguation?.disambiguationOptions?.[0]?.parameterValue;
      const fromOpt = last?.fromLocationDisambiguation?.disambiguationOptions?.[0]?.parameterValue;
      if (!toOpt && !fromOpt) break;
      if (toOpt) endVal = encodeURIComponent(String(toOpt));
      if (fromOpt) startVal = encodeURIComponent(String(fromOpt));
    }
    return last;
  })();
}

export function getNearbyStops(lat, lon) {
  return request(`/StopPoint?lat=${lat}&lon=${lon}&stopTypes=NaptanMetroStation,NaptanRailStation,NaptanPublicBusCoachTram&radius=900`);
}

export function searchBikePoints(query) {
  return request(`/BikePoint/Search?query=${encodeURIComponent(query.trim())}`);
}

export async function searchPlaces(query) {
  // Use StopPoint Search; return empty array on error
  try {
    return await request(`/StopPoint/Search?query=${encodeURIComponent(query.trim())}`);
  } catch (err) {
    return [];
  }
}

export function getBikePoint(id) {
  return request(`/BikePoint/${encodeURIComponent(id)}`);
}

export function propertyValue(place, key) {
  const item = place?.additionalProperties?.find((property) => property.key === key);
  return item?.value || '0';
}
