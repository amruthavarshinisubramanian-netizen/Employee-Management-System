import { NavLink, useNavigate } from "react-router-dom";
import {
  FaChartPie,
  FaUsers,
  FaCalendarCheck,
  FaAward,
  FaFileAlt,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
  FaBuilding,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../Common/Avatar";

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: <FaChartPie className="nav-icon" /> },
    { label: "Employees", path: "/employees", icon: <FaUsers className="nav-icon" /> },
    { label: "Leave Management", path: "/leaves", icon: <FaCalendarCheck className="nav-icon" /> },
    { label: "Performance", path: "/performance", icon: <FaAward className="nav-icon" /> },
    { label: "Reports & Analytics", path: "/reports", icon: <FaFileAlt className="nav-icon" /> },
  ];

  const systemItems = [
    { label: "My Profile", path: "/profile", icon: <FaUserCircle className="nav-icon" /> },
    { label: "Settings", path: "/settings", icon: <FaCog className="nav-icon" /> },
  ];

  return (
    <>
      {isOpen && <div className="mobile-overlay" onClick={onClose}></div>}
      <aside className={`sidebar ${isOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-header">
          <NavLink to="/dashboard" className="brand-logo" onClick={onClose}>
            <div className="brand-icon-box">
              <FaBuilding />
            </div>
            <span>PulseHR</span>
          </NavLink>
          {isOpen && (
            <button
              type="button"
              className="btn btn-link text-white p-0 d-lg-none"
              onClick={onClose}
              aria-label="Close Sidebar"
            >
              <FaTimes />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">Main Menu</div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item-link ${isActive ? "active" : ""}`}
              onClick={onClose}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}

          <div className="nav-section-title">System & Account</div>
          {systemItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item-link ${isActive ? "active" : ""}`}
              onClick={onClose}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-mini-card mb-2">
            <Avatar name={user?.name || "HR Admin"} size="sm" src={user?.avatar} />
            <div className="overflow-hidden flex-grow-1">
              <div className="text-white small fw-bold text-truncate">{user?.name || "HR Admin"}</div>
              <div className="text-muted" style={{ fontSize: "0.72rem" }}>
                {user?.role || "HR Administrator"}
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm w-100 d-flex align-items-center justify-content-center gap-2 py-1"
            onClick={handleLogout}
            style={{ borderRadius: "8px" }}
          >
            <FaSignOutAlt />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
