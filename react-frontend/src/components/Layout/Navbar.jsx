import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaBars,
  FaBell,
  FaMoon,
  FaSun,
  FaUserCircle,
  FaSignOutAlt,
  FaCog,
  FaCheckDouble,
  FaInfoCircle,
  FaCalendarCheck,
  FaAward,
  FaBullseye,
} from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import api from "../../services/api";
import Avatar from "../Common/Avatar";

export default function Navbar({ onToggleSidebar }) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 45000);
    return () => clearInterval(interval);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifMenu(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await api.getNotifications();
      if (Array.isArray(data)) {
        setNotifications(data);
      }
    } catch {
      // Fail silently for background polling
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      showToast("All notifications marked as read", "success");
    } catch {
      showToast("Failed to mark notifications as read", "error");
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead && notif.id) {
      try {
        await api.markNotificationRead(notif.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
        );
      } catch {
        // ignore
      }
    }
    setShowNotifMenu(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith("/dashboard")) return "Executive Dashboard";
    if (path === "/employees") return "Employee Directory";
    if (path.startsWith("/employees/")) return "Employee Profile";
    if (path === "/add-employee") return "Add New Employee";
    if (path.startsWith("/edit-employee/")) return "Edit Employee";
    if (path.startsWith("/leaves")) return "Leave Management";
    if (path.startsWith("/performance")) return "Performance Management";
    if (path.startsWith("/reports")) return "HR Analytics & Reports";
    if (path.startsWith("/profile")) return "HR Administrator Profile";
    if (path.startsWith("/settings")) return "System Settings";
    return "PulseHR Management";
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getNotifIcon = (type) => {
    switch (type) {
      case "leave":
        return <FaCalendarCheck className="text-warning" />;
      case "anniversary":
      case "success":
        return <FaAward className="text-success" />;
      case "goal":
        return <FaBullseye className="text-info" />;
      default:
        return <FaInfoCircle className="text-primary" />;
    }
  };

  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <button
          type="button"
          className="icon-btn d-lg-none"
          onClick={onToggleSidebar}
          aria-label="Toggle Navigation"
        >
          <FaBars />
        </button>
        <h1 className="page-title">{getPageTitle()}</h1>
      </div>

      <div className="navbar-right">
        {/* Theme Toggle */}
        <button
          type="button"
          className="icon-btn"
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? <FaSun className="text-warning" /> : <FaMoon />}
        </button>

        {/* Notifications Dropdown */}
        <div className="position-relative" ref={notifRef}>
          <button
            type="button"
            className="icon-btn"
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            title="Notifications"
            aria-label="Notifications"
          >
            <FaBell />
            {unreadCount > 0 && <span className="notification-badge-dot"></span>}
          </button>

          {showNotifMenu && (
            <div className="custom-dropdown-menu" style={{ width: "340px", right: 0 }}>
              <div className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom">
                <span className="fw-bold small text-primary">
                  Notifications {unreadCount > 0 && `(${unreadCount} unread)`}
                </span>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    className="btn btn-link btn-sm p-0 text-decoration-none small text-primary d-flex align-items-center gap-1"
                    onClick={handleMarkAllRead}
                  >
                    <FaCheckDouble size={12} />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                {notifications.length === 0 ? (
                  <div className="text-center py-4 text-muted small">No new notifications</div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-3 py-2 border-bottom cursor-pointer ${
                        !notif.isRead ? "bg-light bg-opacity-25 fw-semibold" : "opacity-75"
                      }`}
                      style={{ fontSize: "0.84rem" }}
                      onClick={() => handleNotificationClick(notif)}
                    >
                      <div className="d-flex align-items-start gap-2">
                        <span className="mt-1 flex-shrink-0">{getNotifIcon(notif.type)}</span>
                        <div className="flex-grow-1 overflow-hidden">
                          <div className="text-truncate text-primary">{notif.title}</div>
                          <div className="text-muted small text-truncate">{notif.message}</div>
                          <div className="text-muted" style={{ fontSize: "0.72rem" }}>
                            {notif.timestamp}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="position-relative" ref={userRef}>
          <button
            type="button"
            className="d-flex align-items-center gap-2 border-0 bg-transparent p-0 cursor-pointer"
            onClick={() => setShowUserMenu(!showUserMenu)}
            aria-label="User menu"
          >
            <Avatar name={user?.name || "HR Admin"} size="sm" src={user?.avatar} />
            <span className="d-none d-md-inline small fw-semibold text-secondary">
              {user?.name?.split(" ")[0] || "Admin"}
            </span>
          </button>

          {showUserMenu && (
            <div className="custom-dropdown-menu" style={{ width: "220px", right: 0 }}>
              <div className="px-3 py-2 border-bottom">
                <div className="fw-bold small text-truncate text-primary">{user?.name || "Admin"}</div>
                <div className="text-muted small text-truncate" style={{ fontSize: "0.75rem" }}>
                  {user?.email || "admin@hrportal.com"}
                </div>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  className="dropdown-item px-3 py-2 d-flex align-items-center gap-2 small text-secondary w-100 bg-transparent border-0 text-start"
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate("/profile");
                  }}
                >
                  <FaUserCircle /> My Profile
                </button>
                <button
                  type="button"
                  className="dropdown-item px-3 py-2 d-flex align-items-center gap-2 small text-secondary w-100 bg-transparent border-0 text-start"
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate("/settings");
                  }}
                >
                  <FaCog /> Settings
                </button>
                <div className="dropdown-divider my-1"></div>
                <button
                  type="button"
                  className="dropdown-item px-3 py-2 d-flex align-items-center gap-2 small text-danger w-100 bg-transparent border-0 text-start"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
                  <FaSignOutAlt /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
