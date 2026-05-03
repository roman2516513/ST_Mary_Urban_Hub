import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import PageHero from '../components/PageHero';
import StatCard from '../components/StatCard';
import { travelModes } from '../data/travelModes';
import { loadFromStorage, saveToStorage } from '../utils/storage';

const goalKey = 'smuh_sustainability_goal';
const chartData = travelModes.map((mode) => ({ name: mode.name, carbon: mode.carbonPerKm }));

export default function Sustainability() {
  const [goal, setGoal] = useState(() => loadFromStorage(goalKey, { target: 20, completed: 8 }));
  const progress = Math.min(100, Math.round((goal.completed / goal.target) * 100));
  const carbonSaved = Math.round(goal.completed * 120);

  function updateGoal(event) {
    const next = { ...goal, [event.target.name]: Number(event.target.value) };
    setGoal(next);
    saveToStorage(goalKey, next);
  }

  return (
    <>
      <PageHero
        eyebrow="Sustainability analytics"
        title="Compare carbon impact and track weekly active travel"
        text="Carbon comparison and a simple goal tracker help users evaluate travel choices and monitor progress towards active travel targets."
      />

      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <section className="surface-card rounded-5 p-4 h-100">
            <h2 className="h4 mb-3">Carbon comparison by mode</h2>
            <div style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} g CO₂e/km`, 'Carbon']} />
                  <Bar dataKey="carbon" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="small text-secondary mb-0">Figures are simplified estimates intended for comparison purposes and do not represent official emissions certification.</p>
          </section>
        </div>
        <div className="col-lg-4">
          <section className="surface-card rounded-5 p-4 h-100">
            <h2 className="h4">Weekly goal tracking</h2>
            <label className="form-label mt-3">Target km<input name="target" type="number" min="1" className="form-control" value={goal.target} onChange={updateGoal} /></label>
            <label className="form-label mt-2">Completed km<input name="completed" type="number" min="0" className="form-control" value={goal.completed} onChange={updateGoal} /></label>
            <div className="progress rounded-pill my-3" role="progressbar" aria-label="Goal progress" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
              <div className="progress-bar" style={{ width: `${progress}%` }}>{progress}%</div>
            </div>
            <div className="mt-3">
              <StatCard icon="bi-leaf" label="Estimated car emissions avoided" value={`${carbonSaved} g`} note="Based on active travel distance" />
            </div>
          </section>
        </div>
      </div>

      <section className="surface-card rounded-5 p-4">
        <h2 className="h4">Design rationale</h2>
        <p className="text-secondary mb-0">This section provides concise, actionable feedback: a visual carbon comparison, configurable weekly targets and progress indicators to support behaviour change and informed travel choices.</p>
      </section>
    </>
  );
}
