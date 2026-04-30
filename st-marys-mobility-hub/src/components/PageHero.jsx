export default function PageHero({ eyebrow, title, text, children }) {
  return (
    <section className="page-hero rounded-5 p-4 p-lg-5 mb-4">
      <p className="eyebrow mb-2">{eyebrow}</p>
      <div className="row align-items-center g-4">
        <div className="col-lg-8">
          <h1 className="display-6 fw-bold mb-3">{title}</h1>
          <p className="lead text-secondary mb-0">{text}</p>
        </div>
        {children && <div className="col-lg-4">{children}</div>}
      </div>
    </section>
  );
}
