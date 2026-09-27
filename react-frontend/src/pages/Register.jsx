import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBuilding, FaUser, FaEnvelope, FaLock, FaUserPlus } from "react-icons/fa";
import api from "../services/api";
import { useToast } from "../context/ToastContext";

export default function Register() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
    if (errorMsg) setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.name.trim() || !user.email.trim() || !user.password.trim()) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    if (user.password.length < 4) {
      setErrorMsg("Password must be at least 4 characters.");
      return;
    }

    setSubmitting(true);
    try {
      // Calls existing backend endpoint: /users/register
      const message = await api.register(user);

      if (message === "Registration Successful") {
        showToast("Registration successful! You can now log in.", "success");
        navigate("/login");
      } else {
        setErrorMsg(message || "Registration failed. Email may already be in use.");
        showToast(message || "Registration failed", "error");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Server error: Unable to connect to backend service.");
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
          <h3 className="fw-bold text-primary mb-1">Create HR Account</h3>
          <p className="text-muted small">Register as an administrator for PulseHR Portal</p>
        </div>

        {errorMsg && (
          <div className="alert alert-danger py-2 px-3 small rounded-3 mb-3 d-flex align-items-center" role="alert">
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label-custom">Full Name</label>
            <div className="position-relative">
              <input
                type="text"
                name="name"
                className="form-control-custom ps-5"
                placeholder="Amruthavarshini S"
                value={user.name}
                onChange={handleChange}
                required
              />
              <FaUser
                className="position-absolute text-muted"
                style={{ left: "15px", top: "50%", transform: "translateY(-50%)" }}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label-custom">Work Email Address</label>
            <div className="position-relative">
              <input
                type="email"
                name="email"
                className="form-control-custom ps-5"
                placeholder="admin@hrportal.com"
                value={user.email}
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
                value={user.password}
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
            <FaUserPlus /> {submitting ? "Registering..." : "Create Account"}
          </button>

          <div className="text-center mt-4">
            <span className="text-muted small">Already have an administrator account? </span>
            <Link to="/login" className="fw-semibold text-primary text-decoration-none small">
              Sign In Here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}