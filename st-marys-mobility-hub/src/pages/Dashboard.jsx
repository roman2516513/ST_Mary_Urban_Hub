import { useEffect, useState } from 'react';
import PageHero from '../components/PageHero';
import EmptyState from '../components/EmptyState';
import StatusPill from '../components/StatusPill';
import { getLineStatuses } from '../services/tflApi';
import { loadFromStorage, saveToStorage } from '../utils/storage';

const journeysKey = 'smuh_saved_journeys';
const profileKey = 'smuh_profile';
const alertsKey = 'smuh_alerts';

export default function Dashboard() {
  const [savedJourneys, setSavedJourneys] = useState(() => loadFromStorage(journeysKey, []));
  const [profile, setProfile] = useState(() => loadFromStorage(profileKey, { preferredMode: 'Tube', typicalTime: 35 }));
  const [alertLine, setAlertLine] = useState('central');
  const [alerts, setAlerts] = useState(() => loadFromStorage(alertsKey, ['central', 'jubilee']));
  const [lineStatuses, setLineStatuses] = useState([]);

  useEffect(() => {
    getLineStatuses().then(setLineStatuses).catch(() => setLineStatuses([]));
  }, []);

  function updateProfile(event) {
    const next = { ...profile, [event.target.name]: event.target.value };
    setProfile(next);
    saveToStorage(profileKey, next);
  }

  function addAlert(event) {
    event.preventDefault();
    const clean = alertLine.trim().toLowerCase().replaceAll(' ', '-');
    if (!clean || alerts.includes(clean)) return;
    const next = [clean, ...alerts].slice(0, 6);
    setAlerts(next);
    saveToStorage(alertsKey, next);
    setAlertLine('');
  }

  function removeAlert(line) {
    const next = alerts.filter((item) => item !== line);
    setAlerts(next);
    saveToStorage(alertsKey, next);
  }

  function clearJourney(id) {
    const next = savedJourneys.filter((journey) => journey.id !== id);
    setSavedJourneys(next);
    saveToStorage(journeysKey, next);
  }

  const watchedStatuses = alerts.map((lineId) => lineStatuses.find((line) => line.id === lineId)).filter(Boolean);

  return (
    <>
      <PageHero
        eyebrow="Advanced personalisation"
        title="Personal travel dashboard"
        text="Users can save favourite journeys, store typical travel preferences and set custom line alerts using localStorage plus live TfL status checks."
      />

      <div className="row g-4">
        <div className="col-lg-4">
          <section className="surface-card rounded-5 p-4 h-100">
            <h2 className="h4">Travel preferences</h2>
            <label className="form-label mt-3">Preferred mode<input name="preferredMode" className="form-control" value={profile.preferredMode} onChange={updateProfile} /></label>
            <label className="form-label mt-2">Typical travel time<input name="typicalTime" type="number" className="form-control" value={profile.typicalTime} onChange={updateProfile} /></label>
            <div className="profile-summary mt-3 p-3 rounded-4">Your usual choice is <strong>{profile.preferredMode}</strong>, with a typical trip time of <strong>{profile.typicalTime} minutes</strong>.</div>
          </section>
        </div>

        <div className="col-lg-8">
          <section className="surface-card rounded-5 p-4 h-100">
            <div className="d-flex justify-content-between gap-3 align-items-center mb-3">
              <div><h2 className="h4 mb-1">Saved journeys</h2><p className="small text-secondary mb-0">Saved from the TfL journey planner.</p></div>
            </div>
            {savedJourneys.length === 0 && <EmptyState title="No saved journeys" text="Search for a route in the planner and save it to personalise this dashboard." />}
            <div className="row g-3">
              {savedJourneys.map((journey) => (
                <div className="col-md-6" key={journey.id}>
                  <article className="mini-card h-100">
                    <div className="d-flex justify-content-between gap-2">
                      <strong>{journey.from} → {journey.to}</strong>
                      <button className="btn btn-sm btn-light" onClick={() => clearJourney(journey.id)} aria-label="Remove journey"><i className="bi bi-x"></i></button>
                    </div>
                    <p className="small text-secondary mb-0">Typical TfL duration: {journey.duration} min</p>
                  </article>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <section className="surface-card rounded-5 p-4 mt-4">
        <div className="row g-4">
          <div className="col-lg-5">
            <h2 className="h4">Custom travel alerts</h2>
            <p className="text-secondary small">Type a TfL line id such as <strong>central</strong>, <strong>jubilee</strong>, <strong>northern</strong> or <strong>elizabeth</strong>.</p>
            <form onSubmit={addAlert} className="input-group">
              <input className="form-control" value={alertLine} onChange={(event) => setAlertLine(event.target.value)} />
              <button className="btn btn-primary">Add alert</button>
            </form>
          </div>
          <div className="col-lg-7">
            <div className="row g-3">
              {watchedStatuses.map((line) => (
                <div className="col-md-6" key={line.id}>
                  <article className="line-card h-100">
                    <div className="d-flex justify-content-between mb-2"><strong>{line.name}</strong><button className="btn btn-sm btn-light" onClick={() => removeAlert(line.id)}>Remove</button></div>
                    <StatusPill status={line.lineStatuses?.[0]?.statusSeverityDescription} />
                    <p className="small text-secondary mt-2 mb-0">{line.lineStatuses?.[0]?.reason || 'No specific disruption message.'}</p>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
