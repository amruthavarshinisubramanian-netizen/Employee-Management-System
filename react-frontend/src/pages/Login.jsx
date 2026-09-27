import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBuilding, FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
    if (errorMsg) setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.email.trim() || !credentials.password.trim()) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setSubmitting(true);
    try {
      // Calls existing backend endpoint: /users/login
      const message = await api.login(credentials);

      if (message === "Login Successful") {
        login({
          email: credentials.email,
          name: credentials.email.split("@")[0].toUpperCase(),
          role: "HR Administrator",
        });
        showToast("Welcome back! Login successful.", "success");
        navigate("/dashboard");
      } else {
        setErrorMsg("Invalid email or password. Please try again.");
        showToast("Invalid credentials", "error");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Server error: Unable to reach backend. Please ensure Spring Boot is running.");
      showToast("Cannot connect to server", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        {/* Brand Header */}
        <div className="text-center mb-4">
          <div className="brand-icon-box mx-auto mb-3" style={{ width: "48px", height: "48px", fontSize: "1.4rem" }}>
            <FaBuilding />
          </div>
          <h3 className="fw-bold text-primary mb-1">PulseHR Enterprise</h3>
          <p className="text-muted small">Sign in to access your HR Management Portal</p>
        </div>

        {errorMsg && (
          <div className="alert alert-danger py-2 px-3 small rounded-3 mb-3 d-flex align-items-center" role="alert">
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label-custom">Work Email Address</label>
            <div className="position-relative">
              <input
                type="email"
                name="email"
                className="form-control-custom ps-5"
                placeholder="admin@hrportal.com"
                value={credentials.email}
                onChange={handleChange}
                required
              />
              <FaEnvelope
                className="position-absolute text-muted"
                style={{ left: "15px", top: "50%", transform: "translateY(-50%)" }}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label-custom">Password</label>
            <div className="position-relative">
              <input
                type="password"
                name="password"
                className="form-control-custom ps-5"
                placeholder="••••••••"
                value={credentials.password}
                onChange={handleChange}
                required
              />
              <FaLock
                className="position-absolute text-muted"
                style={{ left: "15px", top: "50%", transform: "translateY(-50%)" }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary-custom w-100 justify-content-center py-2"
            disabled={submitting}
          >
            <FaSignInAlt /> {submitting ? "Signing In..." : "Sign In to Portal"}
          </button>

          <div className="text-center mt-4">
            <span className="text-muted small">Don't have an administrator account? </span>
            <Link to="/register" className="fw-semibold text-primary text-decoration-none small">
              Register Here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}