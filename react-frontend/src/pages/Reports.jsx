import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";
import {
  FaFileDownload,
  FaPrint,
  FaUsers,
  FaMoneyBillWave,
  FaChartPie,
  FaCalendarAlt,
} from "react-icons/fa";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import { useTheme } from "../context/ThemeContext";
import LoadingSpinner from "../components/Common/LoadingSpinner";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function Reports() {
  const { showToast } = useToast();
  const { theme } = useTheme();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    loadReportsData();
  }, []);

  const loadReportsData = async () => {
    setLoading(true);
    try {
      const [statsRes, empsRes] = await Promise.all([
        api.getDashboardStats(),
        api.getEmployees(),
      ]);
      setStats(statsRes);
      setEmployees(Array.isArray(empsRes) ? empsRes : []);
    } catch (err) {
      console.error(err);
      showToast("Error loading report metrics: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const isDark = theme === "dark";
  const textColor = isDark ? "#cbd5e1" : "#475569";
  const gridColor = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)";

  const deptLabels = stats?.departmentCounts ? Object.keys(stats.departmentCounts) : [];
  const deptData = stats?.departmentCounts ? Object.values(stats.departmentCounts) : [];
  const deptChartData = {
    labels: deptLabels,
    datasets: [
      {
        data: deptData,
        backgroundColor: ["#6366f1", "#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"],
        borderWidth: 0,
      },
    ],
  };

  const statusLabels = stats?.statusCounts ? Object.keys(stats.statusCounts) : [];
  const statusData = stats?.statusCounts ? Object.values(stats.statusCounts) : [];
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

  const trendLabels = stats?.joiningTrends ? Object.keys(stats.joiningTrends) : [];
  const trendData = stats?.joiningTrends ? Object.values(stats.joiningTrends) : [];
  const trendChartData = {
    labels: trendLabels,
    datasets: [
      {
        label: "Hires per Year",
        data: trendData,
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        fill: true,
        tension: 0.3,
        pointBackgroundColor: "#6366f1",
      },
    ],
  };

  const perfLabels = stats?.performanceCounts ? Object.keys(stats.performanceCounts) : [];
  const perfData = stats?.performanceCounts ? Object.values(stats.performanceCounts) : [];
  const perfChartData = {
    labels: perfLabels.map((l) => l.split(" ")[0]),
    datasets: [
      {
        label: "Headcount",
        data: perfData,
        backgroundColor: ["#ef4444", "#f97316", "#3b82f6", "#6366f1", "#10b981"],
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: textColor },
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

  const exportCSV = () => {
    if (employees.length === 0) return;

    const headers = [
      "ID",
      "Name",
      "Email",
      "Department",
      "Designation",
      "Status",
      "Date of Joining",
      "Monthly Salary",
      "Performance Score",
    ];

    const rows = employees.map((e) => [
      `EMP-${e.id}`,
      `"${e.name || ""}"`,
      `"${e.email || ""}"`,
      `"${e.department || ""}"`,
      `"${e.designation || ""}"`,
      e.status || "Active",
      e.dateOfJoining || "N/A",
      e.salary || 0,
      e.performanceScore || 3,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encoded = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encoded);
    link.setAttribute("download", `HR_Executive_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Downloaded complete HR report", "success");
  };

  if (loading) {
    return <LoadingSpinner message="Generating consolidated HR analytics..." size="lg" />;
  }

  const avgSalary = stats?.averageSalary || 0;

  return (
    <div className="reports-page">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold text-primary mb-1">HR Reports & Workforce Analytics</h4>
          <p className="text-muted small mb-0">
            Executive summary of organizational headcounts, performance distributions, and salary budgets
          </p>
        </div>

        <div className="d-flex gap-2">
          <button type="button" className="btn-outline-custom" onClick={() => window.print()}>
            <FaPrint /> Print Report
          </button>
          <button type="button" className="btn-primary-custom" onClick={exportCSV}>
            <FaFileDownload /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="kpi-card">
            <div className="kpi-info">
              <h6>Total Headcount</h6>
              <h3>{stats?.totalEmployees || employees.length}</h3>
              <div className="kpi-subtext">Active & Inactive Staff</div>
            </div>
            <div className="kpi-icon-box kpi-blue">
              <FaUsers />
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="kpi-card">
            <div className="kpi-info">
              <h6>Average Salary</h6>
              <h3>₹{avgSalary.toLocaleString("en-IN")}</h3>
              <div className="kpi-subtext">Per Month per Employee</div>
            </div>
            <div className="kpi-icon-box kpi-green">
              <FaMoneyBillWave />
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="kpi-card">
            <div className="kpi-info">
              <h6>Departments</h6>
              <h3>{deptLabels.length}</h3>
              <div className="kpi-subtext">Business Divisions</div>
            </div>
            <div className="kpi-icon-box kpi-amber">
              <FaChartPie />
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="kpi-card">
            <div className="kpi-info">
              <h6>Active Rate</h6>
              <h3>
                {stats?.totalEmployees
                  ? Math.round((stats.activeEmployees / stats.totalEmployees) * 100)
                  : 100}
                %
              </h3>
              <div className="kpi-subtext">Operational Capacity</div>
            </div>
            <div className="kpi-icon-box kpi-gray">
              <FaCalendarAlt />
            </div>
          </div>
        </div>
      </div>

      {/* 4 Professional Charts Grid */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-6">
          <div className="portal-card h-100">
            <h5 className="card-title mb-3">Department Headcount Distribution</h5>
            <div style={{ height: "260px" }}>
              <Doughnut data={deptChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="portal-card h-100">
            <h5 className="card-title mb-3">Employment Status Distribution</h5>
            <div style={{ height: "260px" }}>
              <Pie data={statusChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="portal-card h-100">
            <h5 className="card-title mb-3">Annual Joining & Retention Trends</h5>
            <div style={{ height: "260px" }}>
              <Line data={trendChartData} options={barLineOptions} />
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="portal-card h-100">
            <h5 className="card-title mb-3">Performance Score Breakdown</h5>
            <div style={{ height: "260px" }}>
              <Bar data={perfChartData} options={barLineOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Department Breakdown Table */}
      <div className="portal-card p-0 overflow-hidden">
        <div className="p-3 border-bottom">
          <h5 className="card-title mb-0">Departmental Payroll & Headcount Summary</h5>
        </div>
        <div className="custom-table-container border-0">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Employee Count</th>
                <th>Active Ratio</th>
                <th>Average Rating</th>
                <th>Estimated Monthly Payroll</th>
              </tr>
            </thead>
            <tbody>
              {deptLabels.map((dept) => {
                const deptEmps = employees.filter((e) => e.department === dept);
                const activeInDept = deptEmps.filter((e) => e.status === "Active").length;
                const avgScore =
                  deptEmps.reduce((acc, curr) => acc + (curr.performanceScore || 3), 0) /
                  (deptEmps.length || 1);
                const totalSalary = deptEmps.reduce((acc, curr) => acc + (curr.salary || 65000), 0);

                return (
                  <tr key={dept}>
                    <td className="fw-bold text-primary">{dept}</td>
                    <td>{deptEmps.length} Employees</td>
                    <td>
                      <span className="badge-pill-soft">
                        {Math.round((activeInDept / (deptEmps.length || 1)) * 100)}% Active
                      </span>
                    </td>
                    <td>
                      <span className="fw-semibold text-secondary">
                        {avgScore.toFixed(1)} / 5.0
                      </span>
                    </td>
                    <td className="fw-bold text-success">
                      ₹{totalSalary.toLocaleString("en-IN")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
