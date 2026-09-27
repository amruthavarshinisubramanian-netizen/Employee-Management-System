import { createContext, useContext, useState, useCallback } from "react";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes, FaExclamationTriangle } from "react-icons/fa";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = "info", duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const newToast = { id, message, type, duration };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const getToastIcon = (type) => {
    switch (type) {
      case "success":
        return <FaCheckCircle className="toast-icon text-success" />;
      case "error":
        return <FaExclamationCircle className="toast-icon text-danger" />;
      case "warning":
        return <FaExclamationTriangle className="toast-icon text-warning" />;
      case "info":
      default:
        return <FaInfoCircle className="toast-icon text-primary" />;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-portal-container" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`custom-toast custom-toast-${toast.type}`}>
            <div className="d-flex align-items-center">
              <span className="me-2 fs-5 d-flex align-items-center">{getToastIcon(toast.type)}</span>
              <div className="toast-message flex-grow-1">{toast.message}</div>
              <button
                type="button"
                className="btn-close-toast ms-2"
                onClick={() => removeToast(toast.id)}
                aria-label="Close"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
