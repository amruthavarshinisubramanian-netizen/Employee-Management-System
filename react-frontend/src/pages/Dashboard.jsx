import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  FaUsers,
  FaUserCheck,
  FaCalendarMinus,
  FaUserTimes,
  FaUserPlus,
  FaCalendarAlt,
  FaChartBar,
  FaTrophy,
  FaArrowRight,
  FaHistory,
  FaStar,
} from "react-icons/fa";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import { useTheme } from "../context/ThemeContext";
import StatCard from "../components/Common/StatCard";
import Avatar from "../components/Common/Avatar";
import Badge from "../components/Common/Badge";
import StarRating from "../components/Common/StarRating";
import LoadingSpinner from "../components/Common/LoadingSpinner";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { theme } = useTheme();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [employeeOfMonth, setEmployeeOfMonth] = useState(null);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, employeesRes, eomRes, activitiesRes] = await Promise.allSettled([
        api.getDashboardStats(),
        api.getEmployees(),
        api.getEmployeeOfTheMonth(),
        api.getRecentActivities(),
      ]);

      if (statsRes.status === "fulfilled") setStats(statsRes.value);
      if (employeesRes.status === "fulfilled") {
        setEmployees(Array.isArray(employeesRes.value) ? employeesRes.value : []);
      }
      if (eomRes.status === "fulfilled") setEmployeeOfMonth(eomRes.value);
      if (activitiesRes.status === "fulfilled") {
        setActivities(Array.isArray(activitiesRes.value) ? activitiesRes.value : []);
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to load some dashboard metrics", "error");
    } finally {
      setLoading(false);
    }
  };

  const isDark = theme === "dark";
  const textColor = isDark ? "#cbd5e1" : "#475569";
  const gridColor = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)";

  // Department distribution chart data
  const deptLabels = stats?.departmentCounts ? Object.keys(stats.departmentCounts) : [];
  const deptData = stats?.departmentCounts ? Object.values(stats.departmentCounts) : [];
  const deptChartData = {
    labels: deptLabels.length > 0 ? deptLabels : ["Engineering", "Quality Assurance", "Product"],
    datasets: [
      {
        data: deptData.length > 0 ? deptData : [4, 3, 1],
        backgroundColor: [
          "#6366f1",
          "#3b82f6",
          "#10b981",
          "#f59e0b",
          "#ec4899",
          "#8b5cf6",
        ],
        borderWidth: 0,
      },
    ],
  };

  // Status distribution chart data
  const statusLabels = stats?.statusCounts ? Object.keys(stats.statusCounts) : ["Active", "On Leave", "Inactive"];
  const statusData = stats?.statusCounts ? Object.values(stats.statusCounts) : [6, 1, 1];
  const statusChartData = {
    labels: statusLabels,
    datasets: [
      {
        data: statusData,
        backgroundColor: ["#10b981", "#f59e0b", "#94a3b8"],
        borderWidth: 0,
      },
    ],
  };

  // Joining trends chart data
  const trendLabels = stats?.joiningTrends ? Object.keys(stats.joiningTrends) : ["2023", "2024", "2025", "2026"];
  const trendData = stats?.joiningTrends ? Object.values(stats.joiningTrends) : [3, 3, 1, 1];
  const trendChartData = {
    labels: trendLabels,
    datasets: [
      {
        label: "Employees Joined",
        data: trendData,
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.15)",
        fill: true,
        tension: 0.35,
        pointBackgroundColor: "#6366f1",
        pointBorderColor: "#fff",
        pointRadius: 5,
      },
    ],
  };

  // Performance overview chart data
  const perfLabels = stats?.performanceCounts ? Object.keys(stats.performanceCounts) : [
    "Needs Improvement (1)",
    "Developing (2)",
    "Meets Expectations (3)",
    "Very Good (4)",
    "Excellent (5)",
  ];
  const perfData = stats?.performanceCounts ? Object.values(stats.performanceCounts) : [0, 1, 1, 4, 2];
  const perfChartData = {
    labels: perfLabels.map((l) => l.split(" ")[0]),
    datasets: [
      {
        label: "Employees",
        data: perfData,
        backgroundColor: [
          "#ef4444",
          "#f97316",
          "#3b82f6",
          "#6366f1",
          "#10b981",
        ],
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: textColor, font: { family: "inherit", size: 12 } },
      },
      tooltip: {
        padding: 10,
        cornerRadius: 8,
      },
    },
  };

  const barLineOptions = {
    ...chartOptions,
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { color: textColor },
      },
      y: {
        beginAtZero: true,
        grid: { color: gridColor },
        ticks: { color: textColor, stepSize: 1 },
      },
    },
  };

  if (loading) {
    return <LoadingSpinner message="Loading HR analytics and employee metrics..." size="lg" />;
  }

  const topEmp = employeeOfMonth?.employee;

  return (
    <div className="dashboard-page">
      {/* 4 KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Total Employees"
            value={stats?.totalEmployees ?? employees.length}
            subtext="Enterprise Workforce"
            icon={<FaUsers />}
            color="blue"
            onClick={() => navigate("/employees")}
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Active Employees"
            value={stats?.activeEmployees ?? employees.filter((e) => e.status === "Active").length}
            subtext="Currently On Duty"
            icon={<FaUserCheck />}
            color="green"
            onClick={() => navigate("/employees?status=Active")}
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Employees On Leave"
            value={stats?.onLeaveEmployees ?? employees.filter((e) => e.status === "On Leave").length}
            subtext="Approved Absences"
            icon={<FaCalendarMinus />}
            color="amber"
            onClick={() => navigate("/leaves")}
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Inactive Employees"
            value={stats?.inactiveEmployees ?? employees.filter((e) => e.status === "Inactive").length}
            subtext="Offboarded / Inactive"
            icon={<FaUserTimes />}
            color="gray"
            onClick={() => navigate("/employees?status=Inactive")}
          />
        </div>
      </div>

      {/* Employee of the Month Banner & Quick Actions */}
      <div className="row g-4 mb-4">
        {/* Employee of the Month */}
        <div className="col-12 col-lg-8">
          <div className="eom-banner h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="eom-badge-ribbon">
                <FaTrophy className="text-warning" />
                <span>Employee of the Month — {employeeOfMonth?.awardedDate || "Current Month"}</span>
              </div>

              {topEmp ? (
                <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-4 mt-2">
                  <Avatar
                    src={topEmp.avatarUrl}
                    name={topEmp.name}
                    size="xl"
                    className="border border-3 border-light shadow"
                  />
                  <div>
                    <h3 className="fw-bold mb-1 text-white">{topEmp.name}</h3>
                    <p className="text-light text-opacity-75 mb-2 small">
                      {topEmp.designation || "Senior Technical Lead"} &bull; {topEmp.department}
                    </p>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <StarRating score={topEmp.performanceScore || 5} size={16} />
                      <span className="badge bg-warning text-dark fw-bold">
                        {topEmp.performanceScore || 5}.0 Rating
                      </span>
                    </div>
                    <p className="text-light text-opacity-90 small mb-0 fst-italic">
                      "{employeeOfMonth?.achievementSummary || topEmp.managerFeedback}"
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-light">Calculating top performer based on annual review ratings...</p>
              )}
            </div>

            <div className="mt-4 pt-3 border-top border-white border-opacity-10 d-flex justify-content-between align-items-center">
              <span className="small text-light text-opacity-75">
                Evaluated systematically via Performance Ratings & Deliverables
              </span>
              {topEmp && (
                <button
                  type="button"
                  className="btn btn-sm btn-light fw-bold px-3 py-1 rounded-pill"
                  onClick={() => navigate(`/employees/${topEmp.id}`)}
                >
                  View Profile <FaArrowRight size={12} className="ms-1" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="col-12 col-lg-4">
          <div className="portal-card h-100">
            <h5 className="card-title mb-3">
              <FaChartBar className="text-primary" /> Quick Actions
            </h5>
            <div className="d-flex flex-column gap-2">
              <button
                type="button"
                className="btn btn-primary-custom w-100 justify-content-between py-2"
                onClick={() => navigate("/add-employee")}
              >
                <span className="d-flex align-items-center gap-2">
                  <FaUserPlus /> Add New Employee
                </span>
                <FaArrowRight size={12} />
              </button>

              <button
                type="button"
                className="btn btn-outline-custom w-100 justify-content-between py-2"
                onClick={() => navigate("/employees")}
              >
                <span className="d-flex align-items-center gap-2">
                  <FaUsers /> View Employee Directory
                </span>
                <FaArrowRight size={12} />
              </button>

              <button
                type="button"
                className="btn btn-outline-custom w-100 justify-content-between py-2"
                onClick={() => navigate("/leaves")}
              >
                <span className="d-flex align-items-center gap-2">
                  <FaCalendarAlt /> Review Leave Requests
                </span>
                <FaArrowRight size={12} />
              </button>

              <button
                type="button"
                className="btn btn-outline-custom w-100 justify-content-between py-2"
                onClick={() => navigate("/reports")}
              >
                <span className="d-flex align-items-center gap-2">
                  <FaChartBar /> Generate HR Reports
                </span>
                <FaArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Professional Charts */}
      <div className="row g-4 mb-4">
        {/* Department Distribution */}
        <div className="col-12 col-lg-6 col-xl-3">
          <div className="portal-card h-100">
            <h5 className="card-title mb-3">Department Headcount</h5>
            <div style={{ height: "240px" }}>
              <Doughnut data={deptChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="col-12 col-lg-6 col-xl-3">
          <div className="portal-card h-100">
            <h5 className="card-title mb-3">Status Breakdown</h5>
            <div style={{ height: "240px" }}>
              <Doughnut data={statusChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Joining Trends */}
        <div className="col-12 col-lg-6 col-xl-3">
          <div className="portal-card h-100">
            <h5 className="card-title mb-3">Hiring & Joining Trends</h5>
            <div style={{ height: "240px" }}>
              <Line data={trendChartData} options={barLineOptions} />
            </div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="col-12 col-lg-6 col-xl-3">
          <div className="portal-card h-100">
            <h5 className="card-title mb-3">Performance Overview</h5>
            <div style={{ height: "240px" }}>
              <Bar data={perfChartData} options={barLineOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Employees & Activity Feed */}
      <div className="row g-4">
        {/* Recent Employees Table */}
        <div className="col-12 col-xl-8">
          <div className="portal-card">
            <div className="card-header-flex">
              <h5 className="card-title">
                <FaUsers className="text-primary" /> Recent Employees
              </h5>
              <button
                type="button"
                className="btn btn-link btn-sm text-decoration-none fw-semibold p-0 text-primary"
                onClick={() => navigate("/employees")}
              >
                View all ({employees.length}) &rarr;
              </button>
            </div>

            <div className="custom-table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Designation</th>
                    <th>Status</th>
                    <th>Score</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.slice(0, 5).map((emp) => (
                    <tr key={emp.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <Avatar src={emp.avatarUrl} name={emp.name} size="sm" />
                          <div>
                            <div className="fw-semibold text-primary">{emp.name}</div>
                            <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                              {emp.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{emp.department || "General"}</td>
                      <td>{emp.designation || "Staff"}</td>
                      <td>
                        <Badge status={emp.status || "Active"} />
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-1">
                          <FaStar className="text-warning" size={12} />
                          <span className="small fw-semibold">{emp.performanceScore || 3}.0</span>
                        </div>
                      </td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn-outline-custom py-1 px-2"
                          style={{ fontSize: "0.78rem" }}
                          onClick={() => navigate(`/employees/${emp.id}`)}
                        >
                          Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Live Activity Timeline */}
        <div className="col-12 col-xl-4">
          <div className="portal-card h-100">
            <h5 className="card-title mb-3">
              <FaHistory className="text-primary" /> Activity Log
            </h5>
            <div className="growth-timeline" style={{ maxHeight: "380px", overflowY: "auto" }}>
              {activities.length === 0 ? (
                <p className="text-muted small">No recent activity recorded.</p>
              ) : (
                activities.slice(0, 6).map((act) => (
                  <div key={act.id} className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-card py-2 px-3">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <span className="badge-pill-soft">{act.action}</span>
                        <span className="text-muted" style={{ fontSize: "0.7rem" }}>
                          {act.timestamp}
                        </span>
                      </div>
                      <p className="small text-secondary mb-0">{act.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}