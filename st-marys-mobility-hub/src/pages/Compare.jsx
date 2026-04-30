import { useState } from 'react';
import PageHero from '../components/PageHero';
import StatCard from '../components/StatCard';
import { travelModes } from '../data/travelModes';
import { estimateJourney, formatMoney, getRecommendation } from '../utils/calculations';

export default function Compare() {
  const [distance, setDistance] = useState(6);
  const [firstMode, setFirstMode] = useState('tube');
  const [secondMode, setSecondMode] = useState('cycle');
  const first = estimateJourney(distance, firstMode);
  const second = estimateJourney(distance, secondMode);

  return (
    <>
      <PageHero
        eyebrow="Client-side interactivity"
        title="Fare estimator and journey comparison"
        text="Estimate fares and compare journey options for different travel modes using local calculations."
      />
      <section className="surface-card rounded-5 p-4 mb-4">
        <div className="row g-3 align-items-end">
          <div className="col-md-4">
            <label className="form-label">Distance in kilometres</label>
            <input type="number" min="0.5" step="0.5" className="form-control form-control-lg" value={distance} onChange={(event) => setDistance(event.target.value)} />
          </div>
          <div className="col-md-4">
            <label className="form-label">First mode</label>
            <select className="form-select form-select-lg" value={firstMode} onChange={(event) => setFirstMode(event.target.value)}>{travelModes.map((mode) => <option key={mode.id} value={mode.id}>{mode.name}</option>)}</select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Second mode</label>
            <select className="form-select form-select-lg" value={secondMode} onChange={(event) => setSecondMode(event.target.value)}>{travelModes.map((mode) => <option key={mode.id} value={mode.id}>{mode.name}</option>)}</select>
          </div>
        </div>
      </section>

      <div className="row g-4 mb-4">
        {[first, second].map((item) => (
          <div className="col-lg-6" key={item.mode.id}>
            <article className="comparison-card rounded-5 p-4 h-100">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="mode-bubble"><i className={`bi ${item.mode.icon}`}></i></div>
                <div><p className="eyebrow mb-1">Estimated result</p><h2 className="h3 mb-0">{item.mode.name}</h2></div>
              </div>
              <div className="row g-3">
                <div className="col-sm-6"><StatCard icon="bi-cash" label="Estimated cost" value={formatMoney(item.cost)} /></div>
                <div className="col-sm-6"><StatCard icon="bi-clock" label="Estimated time" value={`${item.time} min`} /></div>
                <div className="col-sm-6"><StatCard icon="bi-cloud" label="Carbon" value={`${item.carbon} g`} /></div>
                <div className="col-sm-6"><StatCard icon="bi-stars" label="Convenience" value={`${item.convenience}/10`} /></div>
              </div>
            </article>
          </div>
        ))}
      </div>
      <div className="alert recommendation rounded-4 border-0"><i className="bi bi-lightbulb me-2"></i>{getRecommendation(first, second)}</div>
    </>
  );
}
