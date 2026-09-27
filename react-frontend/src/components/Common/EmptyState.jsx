import { FaFolderOpen } from "react-icons/fa";

export default function EmptyState({
  icon = <FaFolderOpen size={48} className="text-muted opacity-50" />,
  title = "No records found",
  description = "There are no items to display at this moment.",
  actionText,
  onAction,
}) {
  return (
    <div className="text-center py-5 px-3">
      <div className="mb-3 d-inline-block">{icon}</div>
      <h5 className="fw-bold text-primary mb-1">{title}</h5>
      <p className="text-muted small mb-3 mx-auto" style={{ maxWidth: "420px" }}>
        {description}
      </p>
      {actionText && onAction && (
        <button type="button" className="btn-primary-custom" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
}
