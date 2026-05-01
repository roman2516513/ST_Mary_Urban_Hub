import { useState, useRef } from 'react';
import PageHero from '../components/PageHero';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import { getNearbyStops, planJourney, searchBikePoints, getBikePoint, propertyValue, searchPlaces } from '../services/tflApi';
import { loadFromStorage, saveToStorage } from '../utils/storage';

const storageKey = 'smuh_saved_journeys';

export default function Planner() {
  const [from, setFrom] = useState('Stratford');
  const [to, setTo] = useState('Waterloo');
  const [journeys, setJourneys] = useState([]);
  const [stops, setStops] = useState([]);
  const [bikeQuery, setBikeQuery] = useState('Waterloo');
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const fromTimer = useRef(null);
  const toTimer = useRef(null);

  async function handleJourney(event) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setJourneys([]);
    try {
      const data = await planJourney(from, to);
      setJourneys(data.journeys || []);
      saveToStorage('smuh_last_search', { from, to, searchedAt: new Date().toISOString() });
    } catch (err) {
      // Show error details if available to help debugging (network/CORS/key issues)
      setMessage(`TfL journey planner error: ${err?.message || 'could not find a route. Use London place names, stations or postcodes.'}`);
    } finally {
      setLoading(false);
    }
  }

  function saveJourney(journey) {
    const saved = loadFromStorage(storageKey, []);
    const next = [
      { id: crypto.randomUUID(), from, to, duration: journey.duration, savedAt: new Date().toISOString() },
      ...saved
    ].slice(0, 8);
    saveToStorage(storageKey, next);
    setMessage('Journey saved to your dashboard.');
  }

  function findNearbyStops() {
    setMessage('');
    if (!navigator.geolocation) {
      setMessage('Geolocation is not available in this browser.');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const data = await getNearbyStops(position.coords.latitude, position.coords.longitude);
          setStops(data.stopPoints?.slice(0, 6) || []);
        } catch {
          setMessage('Nearby TfL stops could not be loaded.');
        } finally {
          setLoading(false);
        }
      },
      () => {
        setMessage('Location permission was not granted.');
        setLoading(false);
      }
    );
  }

  async function handleBikeSearch(event) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const found = await searchBikePoints(bikeQuery);
      const detailed = await Promise.all(found.slice(0, 4).map((point) => getBikePoint(point.id)));
      setBikes(detailed);
    } catch {
      setMessage('Santander Cycle points could not be loaded from TfL.');
    } finally {
      setLoading(false);
    }
  }

  async function fetchPlaceSuggestions(query, setter) {
    if (!query || query.trim().length < 2) {
      setter([]);
      return;
    }
    try {
      const raw = await searchPlaces(query);
      const list = raw?.matches || raw?.places || raw?.results || raw || [];
      const normalized = (list || []).map((item) => {
        // TfL Place/Search returns matches with a `place` object containing `commonName`.
        const place = item?.place || item;
        return place?.commonName || place?.name || place?.id || (typeof place === 'string' ? place : null);
      }).filter(Boolean);
      setter(normalized.slice(0, 6));
    } catch {
      setter([]);
    }
  }

  function scheduleFromSuggestions(value) {
    clearTimeout(fromTimer.current);
    if (!value || value.trim().length < 2) {
      setFromSuggestions([]);
      setShowFromSuggestions(false);
      return;
    }
    fromTimer.current = setTimeout(async () => {
      await fetchPlaceSuggestions(value, (items) => { setFromSuggestions(items); setShowFromSuggestions(items.length > 0); });
    }, 300);
  }

  function scheduleToSuggestions(value) {
    clearTimeout(toTimer.current);
    if (!value || value.trim().length < 2) {
      setToSuggestions([]);
      setShowToSuggestions(false);
      return;
    }
    toTimer.current = setTimeout(async () => {
      await fetchPlaceSuggestions(value, (items) => { setToSuggestions(items); setShowToSuggestions(items.length > 0); });
    }, 300);
  }

  return (
    <>
      <PageHero
        eyebrow="API-driven travel tool"
        title="Journey planner, nearby stops and cycle availability"
        text="This screen uses TfL journey planning, StopPoint and BikePoint APIs to provide route options, nearby stops and cycle availability."
      />

      <div className="row g-4">
        <div className="col-lg-5">
          <section className="surface-card rounded-5 p-4 h-100">
            <h2 className="h4">Plan a TfL journey</h2>
            <p className="text-secondary small">Try London stations, places or postcodes. Example: Stratford to Waterloo.</p>
            <form onSubmit={handleJourney} className="d-grid gap-3">
              <label className="form-label">From
                <input
                  className="form-control form-control-lg mt-1"
                  value={from}
                  onChange={(event) => { setFrom(event.target.value); scheduleFromSuggestions(event.target.value); }}
                  onFocus={() => setShowFromSuggestions(fromSuggestions.length > 0)}
                  onBlur={() => setTimeout(() => setShowFromSuggestions(false), 150)}
                  aria-autocomplete="list"
                  required
                />
              </label>
              {showFromSuggestions && fromSuggestions.length > 0 && (
                <ul className="list-group mb-2">
                  {fromSuggestions.map((s, i) => (
                    <li key={`from-${i}`} className="list-group-item list-group-item-action" onMouseDown={() => { setFrom(s); setShowFromSuggestions(false); }}>
                      {s}
                    </li>
                  ))}
                </ul>
              )}

              <label className="form-label">To
                <input
                  className="form-control form-control-lg mt-1"
                  value={to}
                  onChange={(event) => { setTo(event.target.value); scheduleToSuggestions(event.target.value); }}
                  onFocus={() => setShowToSuggestions(toSuggestions.length > 0)}
                  onBlur={() => setTimeout(() => setShowToSuggestions(false), 150)}
                  aria-autocomplete="list"
                  required
                />
              </label>
              {showToSuggestions && toSuggestions.length > 0 && (
                <ul className="list-group mb-2">
                  {toSuggestions.map((s, i) => (
                    <li key={`to-${i}`} className="list-group-item list-group-item-action" onMouseDown={() => { setTo(s); setShowToSuggestions(false); }}>
                      {s}
                    </li>
                  ))}
                </ul>
              )}

              <button className="btn btn-primary btn-lg rounded-pill" type="submit"><i className="bi bi-search me-2"></i>Find routes</button>
            </form>
          </section>
        </div>

        <div className="col-lg-7">
          {loading && <LoadingState />}
          {message && <div className="alert alert-info border-0 rounded-4">{message}</div>}
          {!loading && journeys.length === 0 && <EmptyState title="No journey results yet" text="Search for a route to see live TfL journey options and save useful results." />}
          <div className="d-grid gap-3">
            {journeys.map((journey, index) => (
              <article className="surface-card rounded-5 p-4" key={`${journey.startDateTime}-${index}`}>
                <div className="d-flex flex-wrap justify-content-between gap-3 mb-3">
                  <div>
                    <p className="eyebrow mb-1">Option {index + 1}</p>
                    <h3 className="h4 mb-0">{journey.duration} minutes</h3>
                  </div>
                  <button className="btn btn-outline-primary rounded-pill" onClick={() => saveJourney(journey)}>Save journey</button>
                </div>
                <div className="route-steps">
                  {journey.legs?.map((leg, legIndex) => (
                    <div className="route-step" key={`${leg.mode?.id}-${legIndex}`}>
                      <span className="step-dot"></span>
                      <div>
                        <strong>{leg.mode?.name || 'Travel'}</strong>
                        <p className="small text-secondary mb-0">{leg.instruction?.summary || leg.instruction?.detailed || 'Continue to next step'} · {leg.duration} min</p>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="row g-4 mt-1">
        <div className="col-lg-6">
          <section className="surface-card rounded-5 p-4 h-100">
            <div className="d-flex justify-content-between gap-3 align-items-center mb-3">
              <div><h2 className="h4 mb-1">Nearby TfL stops</h2><p className="small text-secondary mb-0">Uses browser location plus TfL StopPoint.</p></div>
              <button className="btn btn-outline-primary rounded-pill" onClick={findNearbyStops}>Use my location</button>
            </div>
            <div className="list-group list-group-flush">
              {stops.map((stop) => <div className="list-group-item px-0" key={stop.id}><strong>{stop.commonName}</strong><br /><span className="small text-secondary">{stop.modes?.join(', ')}</span></div>)}
            </div>
          </section>
        </div>
        <div className="col-lg-6">
          <section className="surface-card rounded-5 p-4 h-100">
            <h2 className="h4">Santander Cycles availability</h2>
            <form onSubmit={handleBikeSearch} className="input-group mb-3">
              <input className="form-control" value={bikeQuery} onChange={(event) => setBikeQuery(event.target.value)} aria-label="Bike point search" />
              <button className="btn btn-primary" type="submit">Search bikes</button>
            </form>
            <div className="row g-2">
              {bikes.map((bike) => (
                <div className="col-sm-6" key={bike.id}>
                  <div className="mini-card h-100">
                    <strong>{bike.commonName}</strong>
                    <p className="small text-secondary mb-1">Bikes: {propertyValue(bike, 'NbBikes')} · Spaces: {propertyValue(bike, 'NbEmptyDocks')}</p>
                    <span className="small">Total docks: {propertyValue(bike, 'NbDocks')}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
