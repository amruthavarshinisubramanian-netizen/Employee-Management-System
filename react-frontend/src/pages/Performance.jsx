import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import {
  FaAward,
  FaStar,
  FaCheckCircle,
  FaBullseye,
  FaArrowRight,
  FaEdit,
  FaTimes,
  FaSave,
} from "react-icons/fa";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import { useTheme } from "../context/ThemeContext";
import Avatar from "../components/Common/Avatar";
import StarRating from "../components/Common/StarRating";
import ProgressBar from "../components/Common/ProgressBar";
import LoadingSpinner from "../components/Common/LoadingSpinner";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Performance() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { theme } = useTheme();

  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [goals, setGoals] = useState([]);
  const [eom, setEom] = useState(null);

  // Edit Review Modal
  const [editingEmp, setEditingEmp] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    performanceScore: 4,
    managerFeedback: "",
    lastReviewDate: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [empsRes, goalsRes, eomRes] = await Promise.all([
        api.getEmployees(),
        api.getAllGoals(),
        api.getEmployeeOfTheMonth(),
      ]);
      setEmployees(Array.isArray(empsRes) ? empsRes : []);
      setGoals(Array.isArray(goalsRes) ? goalsRes : []);
      setEom(eomRes);
    } catch (err) {
      console.error(err);
      showToast("Error loading performance data: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReview = (emp) => {
    setEditingEmp(emp);
    setReviewForm({
      performanceScore: emp.performanceScore || 4,
      managerFeedback: emp.managerFeedback || "",
      lastReviewDate: emp.lastReviewDate || new Date().toISOString().slice(0, 10),
    });
  };

  const handleSaveReview = async (e) => {
    e.preventDefault();
    if (!editingEmp) return;
    try {
      const updated = await api.updateEmployee(editingEmp.id, {
        ...editingEmp,
        performanceScore: Number(reviewForm.performanceScore),
        managerFeedback: reviewForm.managerFeedback,
        lastReviewDate: reviewForm.lastReviewDate,
      });

      setEmployees((prev) =>
        prev.map((emp) => (emp.id === editingEmp.id ? updated : emp))
      );
      showToast(`Updated performance review for ${editingEmp.name}`, "success");
      setEditingEmp(null);
    } catch (err) {
      showToast("Failed to update review: " + err.message, "error");
    }
  };

  const isDark = theme === "dark";
  const textColor = isDark ? "#cbd5e1" : "#475569";
  const gridColor = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)";

  // Rating breakdown counts
  const scoreCounts = [1, 2, 3, 4, 5].map(
    (rating) => employees.filter((e) => (e.performanceScore || 3) === rating).length
  );

  const chartData = {
    labels: [
      "1 - Needs Improvement",
      "2 - Developing",
      "3 - Meets Expectations",
      "4 - Very Good",
      "5 - Excellent",
    ],
    datasets: [
      {
        label: "Employees",
        data: scoreCounts,
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
      legend: { display: false },
    },
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
    return <LoadingSpinner message="Calculating organization performance metrics..." size="lg" />;
  }

  const topPerformer = eom?.employee;

  return (
    <div className="performance-page">
      {/* Top Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold text-primary mb-1">Performance Management</h4>
          <p className="text-muted small mb-0">
            Standardized 1-5 rating matrix, manager evaluations, and corporate goal alignment
          </p>
        </div>
      </div>

      {/* Top Performer Card & Chart */}
      <div className="row g-4 mb-4">
        {/* Top Performer Showcase */}
        <div className="col-12 col-lg-5">
          <div className="portal-card h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FaAward className="text-warning fs-4" />
                <h5 className="card-title mb-0">Highest Ranked Performer</h5>
              </div>

              {topPerformer ? (
                <div className="text-center py-3">
                  <Avatar
                    src={topPerformer.avatarUrl}
                    name={topPerformer.name}
                    size="xl"
                    className="border border-3 border-warning shadow mb-2"
                  />
                  <h4 className="fw-bold text-primary mb-1">{topPerformer.name}</h4>
                  <p className="text-muted small mb-2">
                    {topPerformer.designation} &bull; {topPerformer.department}
                  </p>
                  <div className="d-flex justify-content-center align-items-center gap-2 mb-3">
                    <StarRating score={topPerformer.performanceScore || 5} size={18} />
                    <span className="badge bg-warning text-dark fw-bold">
                      {topPerformer.performanceScore || 5}.0 Rating
                    </span>
                  </div>
                  <div className="p-3 bg-light bg-opacity-50 rounded-3 text-secondary small fst-italic">
                    "{topPerformer.managerFeedback || "Outstanding ownership and cross-functional leadership."}"
                  </div>
                </div>
              ) : (
                <p className="text-muted small">No performance data yet</p>
              )}
            </div>

            {topPerformer && (
              <button
                type="button"
                className="btn-outline-custom w-100 justify-content-center mt-3"
                onClick={() => navigate(`/employees/${topPerformer.id}`)}
              >
                View Full Profile &rarr;
              </button>
            )}
          </div>
        </div>

        {/* Rating Breakdown Chart */}
        <div className="col-12 col-lg-7">
          <div className="portal-card h-100">
            <h5 className="card-title mb-3">Organization Score Distribution</h5>
            <div style={{ height: "280px" }}>
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Goal Tracker Overview Across Teams */}
      <div className="portal-card mb-4">
        <h5 className="card-title mb-3">
          <FaBullseye className="text-primary" /> Active Strategic Goals & OKRs
        </h5>
        {goals.length === 0 ? (
          <p className="text-muted small">No goals currently logged in the system.</p>
        ) : (
          <div className="row g-3">
            {goals.slice(0, 4).map((g) => (
              <div key={g.id} className="col-12 col-md-6">
                <div className="p-3 border rounded-3 bg-light bg-opacity-25">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-bold small text-primary">{g.title}</span>
                    <span
                      className={`badge ${
                        g.status === "Completed"
                          ? "bg-success"
                          : g.status === "In Progress"
                          ? "bg-primary"
                          : "bg-secondary"
                      }`}
                    >
                      {g.status}
                    </span>
                  </div>
                  <p className="small text-muted mb-2 text-truncate">{g.description}</p>
                  <ProgressBar value={g.progress} max={100} height={6} showLabel={true} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Employee Ratings Table */}
      <div className="portal-card p-0 overflow-hidden">
        <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Employee Reviews & Feedback Directory</h5>
          <span className="small text-muted">{employees.length} Employees Evaluated</span>
        </div>

        <div className="custom-table-container border-0">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Score</th>
                <th>Performance Level</th>
                <th>Manager Feedback</th>
                <th>Last Review</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <Avatar src={emp.avatarUrl} name={emp.name} size="sm" />
                      <div>
                        <div
                          className="fw-bold text-primary cursor-pointer"
                          onClick={() => navigate(`/employees/${emp.id}`)}
                        >
                          {emp.name}
                        </div>
                        <div className="text-muted" style={{ fontSize: "0.74rem" }}>
                          #EMP-{emp.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge-pill-soft">{emp.department}</span>
                  </td>
                  <td className="small text-secondary">{emp.designation}</td>
                  <td>
                    <div className="d-flex align-items-center gap-1">
                      <StarRating score={emp.performanceScore || 3} size={12} />
                      <span className="small fw-bold ms-1">{emp.performanceScore || 3}.0</span>
                    </div>
                  </td>
                  <td>
                    <span className="small fw-semibold text-secondary">
                      {emp.performanceLevel || "Meets Expectations"}
                    </span>
                  </td>
                  <td>
                    <p
                      className="small text-muted mb-0 text-truncate fst-italic"
                      style={{ maxWidth: "260px" }}
                      title={emp.managerFeedback}
                    >
                      "{emp.managerFeedback || "Standard review completed."}"
                    </p>
                  </td>
                  <td className="small text-muted">{emp.lastReviewDate || "2026-08-15"}</td>
                  <td className="text-end">
                    <button
                      type="button"
                      className="btn-action-icon edit"
                      title="Update Review"
                      onClick={() => handleOpenReview(emp)}
                    >
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Review Modal */}
      {editingEmp && (
        <div className="modal-overlay" onClick={() => setEditingEmp(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5 className="modal-title">Record Review for {editingEmp.name}</h5>
              <button
                type="button"
                className="btn-action-icon"
                onClick={() => setEditingEmp(null)}
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSaveReview}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label-custom">Performance Rating (1 - 5)</label>
                  <select
                    className="form-control-custom"
                    value={reviewForm.performanceScore}
                    onChange={(e) =>
                      setReviewForm({
                        ...reviewForm,
                        performanceScore: Number(e.target.value),
                      })
                    }
                  >
                    <option value={5}>5 - Excellent</option>
                    <option value={4}>4 - Very Good</option>
                    <option value={3}>3 - Meets Expectations</option>
                    <option value={2}>2 - Developing</option>
                    <option value={1}>1 - Needs Improvement</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label-custom">Review Date</label>
                  <input
                    type="date"
                    className="form-control-custom"
                    value={reviewForm.lastReviewDate}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, lastReviewDate: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label-custom">Manager Feedback</label>
                  <textarea
                    rows={4}
                    className="form-control-custom"
                    placeholder="Enter formal manager feedback and performance evaluation..."
                    value={reviewForm.managerFeedback}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, managerFeedback: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-outline-custom"
                  onClick={() => setEditingEmp(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary-custom">
                  <FaSave /> Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
