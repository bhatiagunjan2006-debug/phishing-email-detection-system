import { Link } from "react-router-dom";

const HomePage = () => (
  <main className="page-shell">
    <section className="hero container">
      <div className="hero-copy">
        <p className="eyebrow">Modern Library Operations</p>
        <h1>Borrow smarter, manage faster, and keep every shelf accounted for.</h1>
        <p className="hero-text">
          A full-stack system for discovering books, tracking borrowing, and
          giving admins complete control over inventory and issued records.
        </p>

        <div className="hero-actions">
          <Link className="primary-button" to="/books">
            Explore Books
          </Link>
          <Link className="ghost-button" to="/signup">
            Create Account
          </Link>
        </div>
      </div>

      <div className="hero-panel">
        <div className="metric-card">
          <span>Search</span>
          <strong>Title or author</strong>
        </div>
        <div className="metric-card">
          <span>Roles</span>
          <strong>User + Admin dashboards</strong>
        </div>
        <div className="metric-card">
          <span>Security</span>
          <strong>JWT + bcrypt auth</strong>
        </div>
      </div>
    </section>
  </main>
);

export default HomePage;
