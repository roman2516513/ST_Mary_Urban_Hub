import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import StatCard from '../components/StatCard';
import ApiNotice from '../components/ApiNotice';
import { travelModes } from '../data/travelModes';

export default function Home() {
  return (
    <>
      <PageHero
        eyebrow="St Mary's Urban Mobility Hub"
        title="Plan smarter journeys across London"
        text="A responsive React application for St Mary's Urban Mobility Hub, combining live TfL travel information with personalised planning, alerts and sustainability tools."
      >
        <div className="hero-panel p-3 rounded-4">
          <p className="small text-secondary mb-2">Key features</p>
          <div className="d-grid gap-2">
            <span><i className="bi bi-broadcast-pin me-2"></i>Live TfL network and disruption information</span>
            <span><i className="bi bi-person-check me-2"></i>Personalised journey planner and dashboard</span>
            <span><i className="bi bi-leaf me-2"></i>Sustainability metrics and low-carbon options</span>
          </div>
        </div>
      </PageHero>

      <div className="row g-3 mb-4">
        <div className="col-md-4"><StatCard icon="bi-map" label="Core tool" value="Journey planner" note="TfL route options, duration and step-by-step legs" /></div>
        <div className="col-md-4"><StatCard icon="bi-bell" label="Engagement" value="Custom alerts" note="Save lines and check live disruption status" /></div>
        <div className="col-md-4"><StatCard icon="bi-phone" label="Design" value="Responsive UI" note="Mobile-first layout with accessible controls" /></div>
      </div>

      <section className="surface-card rounded-5 p-4 mb-4">
        <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-3">
          <div>
            <p className="eyebrow mb-2">Urban travel guidance</p>
            <h2 className="h3">Choose the right mode for the journey</h2>
            <p className="text-secondary mb-0">The app helps users compare reliability, cost, journey time and environmental impact before travelling.</p>
          </div>
          <Link className="btn btn-primary rounded-pill align-self-start" to="/planner">Start planning</Link>
        </div>

        <div className="row g-3">
          {travelModes.map((mode) => (
            <div className="col-md-6 col-xl" key={mode.id}>
              <article className="mode-card h-100">
                <i className={`bi ${mode.icon} mode-icon`}></i>
                <h3 className="h5 mt-3">{mode.name}</h3>
                <p className="small text-secondary"><strong>Benefit:</strong> {mode.benefit}</p>
                <p className="small text-secondary mb-0"><strong>Limitation:</strong> {mode.limitation}</p>
              </article>
            </div>
          ))}
        </div>
      </section>

      <div className="row g-4">
        <div className="col-lg-7">
          <section className="surface-card rounded-5 p-4 h-100">
            <p className="eyebrow mb-2">Suggested user flow</p>
            <ol className="timeline mb-0">
              <li>Check live network status before leaving.</li>
              <li>Plan a TfL journey from an origin to destination.</li>
              <li>Compare route options with walking, bus or cycling.</li>
              <li>Save favourite journeys and alert lines to the dashboard.</li>
              <li>Track low-carbon travel goals during the week.</li>
            </ol>
          </section>
        </div>
        <div className="col-lg-5"><ApiNotice /></div>
      </div>
    </>
  );
}
