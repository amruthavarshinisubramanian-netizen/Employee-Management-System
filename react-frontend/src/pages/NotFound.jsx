import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle, FaHome } from "react-icons/fa";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 text-center" style={{ minHeight: "60vh" }}>
      <FaExclamationTriangle className="text-warning mb-3" size={56} />
      <h2 className="fw-bold text-primary mb-2">404 - Page Not Found</h2>
      <p className="text-muted small mb-4" style={{ maxWidth: "400px" }}>
        The page you are looking for does not exist or may have been moved.
      </p>
      <button
        type="button"
        className="btn-primary-custom"
        onClick={() => navigate("/dashboard")}
      >
        <FaHome /> Return to Dashboard
      </button>
    </div>
  );
}
