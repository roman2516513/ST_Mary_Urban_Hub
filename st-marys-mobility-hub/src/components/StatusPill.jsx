export default function StatusPill({ status }) {
  const isGood = status?.toLowerCase().includes('good');
  return <span className={`status-pill ${isGood ? 'good' : 'warning'}`}>{status || 'Unknown'}</span>;
}
