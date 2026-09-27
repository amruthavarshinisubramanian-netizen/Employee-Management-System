import { FaExclamationTriangle, FaTimes } from "react-icons/fa";

export default function ConfirmModal({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "danger",
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h5 className="modal-title d-flex align-items-center gap-2">
            <FaExclamationTriangle className={`text-${confirmVariant}`} />
            {title}
          </h5>
          <button
            type="button"
            className="btn-action-icon"
            onClick={onCancel}
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        <div className="modal-body">
          <p className="text-secondary mb-0">{message}</p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-outline-custom"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`btn ${confirmVariant === "danger" ? "btn-danger" : "btn-primary"} px-3 py-2 rounded-3`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
