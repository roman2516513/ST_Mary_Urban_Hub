import { NavLink, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Planner from './pages/Planner';
import LiveStatus from './pages/LiveStatus';
import Compare from './pages/Compare';
import Dashboard from './pages/Dashboard';
import Sustainability from './pages/Sustainability';
import Guidance from './pages/Guidance';
import NotFound from './pages/NotFound';

const links = [
  ['/', 'Home'],
  ['/planner', 'Planner'],
  ['/status', 'Live TfL'],
  ['/compare', 'Compare'],
  ['/dashboard', 'Dashboard'],
  ['/sustainability', 'Sustainability'],
  ['/guidance', 'Guidance']
];

export default function App() {
  return (
    <>
      <nav className="navbar navbar-expand-lg sticky-top glass-nav">
        <div className="container">
          <NavLink className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/">
            <span className="brand-mark"><i className="bi bi-signpost-split"></i></span>
            St Mary&apos;s Mobility Hub
          </NavLink>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="mainNav">
            <div className="navbar-nav ms-auto gap-lg-1">
              {links.map(([to, label]) => (
                <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>{label}</NavLink>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="container py-4 py-lg-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/status" element={<LiveStatus />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sustainability" element={<Sustainability />} />
          <Route path="/guidance" element={<Guidance />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="container pb-4 text-center small text-secondary">
        Student project. Powered by Transport for London open data; not an official TfL service.
      </footer>
    </>
  );
}
