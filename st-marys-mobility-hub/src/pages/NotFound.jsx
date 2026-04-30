import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="surface-card rounded-5 p-5 text-center">
      <h1>Page not found</h1>
      <p className="text-secondary">The page you requested does not exist.</p>
      <Link className="btn btn-primary rounded-pill" to="/">Back to home</Link>
    </section>
  );
}
