export default function EmptyState({ title, text }) {
  return (
    <div className="empty-state text-center p-5 rounded-4">
      <i className="bi bi-compass display-5 d-block mb-3"></i>
      <h2 className="h5">{title}</h2>
      <p className="text-secondary mb-0">{text}</p>
    </div>
  );
}
