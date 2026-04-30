import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="text-center py-5">
      <h1 className="display-6">Page not found</h1>
      <p className="text-muted">Sorry, we couldn't find that page.</p>
      <p>
        <Link to="/" className="btn btn-primary">Return home</Link>
      </p>
    </div>
  );
}
