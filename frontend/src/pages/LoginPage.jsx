import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth.js";

const LoginPage = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await login(form);
      navigate(location.state?.from?.pathname || "/dashboard");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Login failed");
    }
  };

  return (
    <main className="page-shell auth-page">
      <section className="auth-card">
        <h1>Login</h1>
        <p>Access your dashboard to manage borrowing and book operations.</p>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <button className="primary-button wide-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-footer">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </section>
    </main>
  );
};

export default LoginPage;
