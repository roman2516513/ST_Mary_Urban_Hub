export default function LoadingState({ text = 'Loading live TfL data...' }) {
  return (
    <div className="d-flex align-items-center gap-3 p-4 rounded-4 surface-card">
      <div className="spinner-border spinner-border-sm" role="status" aria-label="Loading"></div>
      <span>{text}</span>
    </div>
  );
}
