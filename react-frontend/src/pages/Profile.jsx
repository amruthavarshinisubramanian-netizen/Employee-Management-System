import { useAuth } from "../context/AuthContext";
import Avatar from "../components/Common/Avatar";
import { FaUserShield, FaEnvelope, FaBuilding, FaCalendarAlt, FaCheckCircle } from "react-icons/fa";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="profile-page" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div className="portal-card mb-4">
        <div className="d-flex flex-column flex-sm-row align-items-center gap-4 text-center text-sm-start">
          <Avatar
            src={user?.avatar}
            name={user?.name || "Admin"}
            size="xl"
            className="border border-3 border-primary shadow"
          />
          <div>
            <div className="d-flex flex-wrap justify-content-center justify-content-sm-start align-items-center gap-2 mb-1">
              <h3 className="fw-bold text-primary mb-0">{user?.name || "Amruthavarshini S"}</h3>
              <span className="badge bg-primary text-white">Super Administrator</span>
            </div>
            <p className="text-secondary fw-semibold mb-2">
              {user?.role || "Human Resources Administrator"}
            </p>
            <div className="d-flex flex-wrap justify-content-center justify-content-sm-start gap-3 text-muted small">
              <span className="d-flex align-items-center gap-1">
                <FaEnvelope className="text-primary" /> {user?.email || "amruthavarshinisubramanian@gmail.com"}
              </span>
              <span className="d-flex align-items-center gap-1">
                <FaBuilding className="text-primary" /> Human Resources & Operations
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-md-6">
          <div className="portal-card h-100">
            <h5 className="card-title mb-3">
              <FaUserShield className="text-primary" /> System Access & Privileges
            </h5>
            <div className="d-flex flex-column gap-2">
              {[
                "Full Employee Directory Read / Write",
                "Leave Approval & Rejection Authority",
                "Performance Score Rating Modification",
                "Salary & Payroll Audit Inspection",
                "Database Seeding & Recovery Access",
              ].map((perm, idx) => (
                <div key={idx} className="d-flex align-items-center gap-2 small text-secondary">
                  <FaCheckCircle className="text-success flex-shrink-0" />
                  <span>{perm}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="portal-card h-100">
            <h5 className="card-title mb-3">
              <FaCalendarAlt className="text-primary" /> Account Metadata
            </h5>
            <div className="d-flex flex-column gap-3 small">
              <div className="d-flex justify-content-between border-bottom pb-2">
                <span className="text-muted">Account Status</span>
                <span className="badge bg-success">Active & Verified</span>
              </div>
              <div className="d-flex justify-content-between border-bottom pb-2">
                <span className="text-muted">Security Level</span>
                <span className="fw-bold text-primary">Level 4 (Executive)</span>
              </div>
              <div className="d-flex justify-content-between border-bottom pb-2">
                <span className="text-muted">Current Portal Session</span>
                <span className="text-secondary">Secured (Local Workspace)</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Last Login Timestamp</span>
                <span className="text-secondary">{new Date().toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
