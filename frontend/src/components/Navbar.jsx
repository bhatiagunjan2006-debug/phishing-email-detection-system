import { Link, NavLink, useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth.js";

const Navbar = () => {
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar-shell">
      <nav className="navbar container">
        <Link to="/" className="brand">
          Stacked Library
        </Link>

        <div className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/books">Books</NavLink>
          {isAuthenticated && <NavLink to="/dashboard">Dashboard</NavLink>}
        </div>

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <span className="welcome-text">
                {user?.name} · {isAdmin ? "Admin" : "User"}
              </span>
              <button className="ghost-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="ghost-button" to="/login">
                Login
              </Link>
              <Link className="primary-button" to="/signup">
                Signup
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
