export default function ApiNotice() {
  return (
    <div className="alert alert-info border-0 rounded-4 small mb-0">
      <strong>Data sources:</strong> Live Transport for London open data is used for line status, journey planning, nearby stops and Santander Cycle availability. To use an API key, set <code>VITE_TFL_APP_KEY</code> in a local <code>.env</code> file.
    </div>
  );
}
