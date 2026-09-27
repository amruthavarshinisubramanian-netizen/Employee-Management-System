export default function LoadingSpinner({ message = "Loading data...", size = "md" }) {
  const spinnerSize = size === "sm" ? "1.5rem" : size === "lg" ? "3rem" : "2.25rem";

  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 text-center">
      <div
        className="spinner-border text-primary mb-3"
        style={{ width: spinnerSize, height: spinnerSize }}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-muted small fw-medium mb-0">{message}</p>
    </div>
  );
}
