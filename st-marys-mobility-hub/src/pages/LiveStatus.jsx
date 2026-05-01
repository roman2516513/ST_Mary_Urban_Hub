import { useEffect, useMemo, useState } from 'react';
import PageHero from '../components/PageHero';
import LoadingState from '../components/LoadingState';
import StatusPill from '../components/StatusPill';
import { getLineStatuses } from '../services/tflApi';

export default function LiveStatus() {
  const [lines, setLines] = useState([]);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLineStatuses()
      .then(setLines)
      .catch(() => setError('Live status could not be loaded. Try again later or set a TfL API key.'))
      .finally(() => setLoading(false));
  }, []);

  const visibleLines = useMemo(() => {
    if (filter === 'all') return lines;
    if (filter === 'problems') {
      return lines.filter((line) => !line.lineStatuses?.[0]?.statusSeverityDescription?.includes('Good'));
    }
    return lines.filter((line) => line.modeName === filter);
  }, [filter, lines]);

  return (
    <>
      <PageHero
        eyebrow="TfL live data"
        title="Network status board"
        text="This page uses the TfL line status endpoint to show current conditions for Tube, DLR, Overground and Elizabeth line services."
      />

      <div className="surface-card rounded-5 p-4 mb-4">
        <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between mb-3">
          <h2 className="h5 mb-0">Live service updates</h2>
          <select className="form-select w-auto" value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter live status">
            <option value="all">All lines</option>
            <option value="problems">Disruptions only</option>
            <option value="tube">Tube</option>
            <option value="dlr">DLR</option>
            <option value="overground">Overground</option>
            <option value="elizabeth-line">Elizabeth line</option>
          </select>
        </div>

        {loading && <LoadingState />}
        {error && <div className="alert alert-warning rounded-4 border-0">{error}</div>}

        <div className="row g-3">
          {visibleLines.map((line) => {
            const status = line.lineStatuses?.[0];
            return (
              <div className="col-md-6 col-xl-4" key={line.id}>
                <article className="line-card h-100">
                  <div className="d-flex justify-content-between gap-3 align-items-start mb-3">
                    <div>
                      <p className="small text-secondary text-capitalize mb-1">{line.modeName}</p>
                      <h3 className="h5 mb-0">{line.name}</h3>
                    </div>
                    <StatusPill status={status?.statusSeverityDescription} />
                  </div>
                  <p className="small text-secondary mb-0">{status?.reason || 'No additional disruption details reported.'}</p>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
