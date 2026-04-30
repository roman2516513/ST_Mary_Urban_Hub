export default function StatCard({ icon, label, value, note }) {
  return (
    <div className="stat-card h-100">
      <div className="stat-icon"><i className={`bi ${icon}`}></i></div>
      <p className="small text-secondary mb-1">{label}</p>
      <h3 className="h4 mb-1">{value}</h3>
      {note && <p className="small text-secondary mb-0">{note}</p>}
    </div>
  );
}
