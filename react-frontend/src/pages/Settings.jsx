import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";
import { FaMoon, FaSun, FaBell, FaShieldAlt, FaSave } from "react-icons/fa";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoApproveLeaves, setAutoApproveLeaves] = useState(false);
  const [itemsPerPageDefault, setItemsPerPageDefault] = useState("10");

  const handleSave = (e) => {
    e.preventDefault();
    showToast("Preferences saved successfully", "success");
  };

  return (
    <div className="settings-page" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div className="mb-4">
        <h4 className="fw-bold text-primary mb-1">Portal Preferences & Settings</h4>
        <p className="text-muted small mb-0">
          Customize UI themes, notification delivery, and table defaults
        </p>
      </div>

      <form onSubmit={handleSave}>
        {/* Theme Preference (Step 17) */}
        <div className="portal-card mb-4">
          <h5 className="card-title mb-3">
            {theme === "dark" ? <FaMoon className="text-warning" /> : <FaSun className="text-warning" />} Theme & Appearance
          </h5>
          <p className="text-muted small mb-3">
            Choose your preferred color theme. Dark mode provides an eye-friendly view for low-light environments.
          </p>

          <div className="d-flex align-items-center justify-content-between p-3 border rounded-3 bg-light bg-opacity-25">
            <div>
              <span className="fw-bold small d-block">Dark Mode Theme</span>
              <span className="text-muted small">
                Currently using <strong>{theme === "dark" ? "Dark Theme" : "Light Theme"}</strong>
              </span>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline-custom d-flex align-items-center gap-2"
              onClick={toggleTheme}
            >
              {theme === "dark" ? <FaSun className="text-warning" /> : <FaMoon />}
              <span>Switch to {theme === "dark" ? "Light" : "Dark"} Mode</span>
            </button>
          </div>
        </div>

        {/* Notifications Preference (Step 16) */}
        <div className="portal-card mb-4">
          <h5 className="card-title mb-3">
            <FaBell className="text-primary" /> Notification Settings
          </h5>
          <div className="d-flex flex-column gap-3">
            <div className="d-flex align-items-center justify-content-between p-3 border rounded-3 bg-light bg-opacity-25">
              <div>
                <span className="fw-bold small d-block">In-App Desktop Notifications</span>
                <span className="text-muted small">
                  Receive live alerts for new employee registrations and leave requests
                </span>
              </div>
              <div className="form-check form-switch fs-5">
                <input
                  className="form-check-input cursor-pointer"
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                />
              </div>
            </div>

            <div className="d-flex align-items-center justify-content-between p-3 border rounded-3 bg-light bg-opacity-25">
              <div>
                <span className="fw-bold small d-block">Email Digest Alerts</span>
                <span className="text-muted small">
                  Send quarterly performance summaries and milestone alerts
                </span>
              </div>
              <div className="form-check form-switch fs-5">
                <input
                  className="form-check-input cursor-pointer"
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* System & Workflow Settings */}
        <div className="portal-card mb-4">
          <h5 className="card-title mb-3">
            <FaShieldAlt className="text-primary" /> Application Configurations
          </h5>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label-custom">Default Table Page Size</label>
              <select
                className="form-control-custom"
                value={itemsPerPageDefault}
                onChange={(e) => setItemsPerPageDefault(e.target.value)}
              >
                <option value="5">5 rows per page</option>
                <option value="10">10 rows per page</option>
                <option value="20">20 rows per page</option>
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label-custom">API Base URL</label>
              <input
                type="text"
                className="form-control-custom"
                value="http://localhost:8080"
                disabled
              />
              <span className="text-muted small">Connected to Spring Boot backend</span>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end">
          <button type="submit" className="btn-primary-custom">
            <FaSave /> Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
