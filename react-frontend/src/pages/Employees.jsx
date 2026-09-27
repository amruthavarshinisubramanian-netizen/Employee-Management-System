import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FaUserPlus,
  FaSearch,
  FaFilter,
  FaFileDownload,
  FaEye,
  FaEdit,
  FaTrash,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaTimes,
  FaStar,
} from "react-icons/fa";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import Avatar from "../components/Common/Avatar";
import Badge from "../components/Common/Badge";
import StarRating from "../components/Common/StarRating";
import ConfirmModal from "../components/Common/ConfirmModal";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import EmptyState from "../components/Common/EmptyState";

export default function Employees() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get("status") || "All");
  const [selectedDesignation, setSelectedDesignation] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");

  // Sorting
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await api.getEmployees();
      if (Array.isArray(data)) {
        setEmployees(data);
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch employees: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (emp) => {
    setEmployeeToDelete(emp);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return;
    try {
      await api.deleteEmployee(employeeToDelete.id);
      showToast(`Employee "${employeeToDelete.name}" deleted successfully`, "success");
      setEmployees((prev) => prev.filter((e) => e.id !== employeeToDelete.id));
    } catch (err) {
      showToast("Error deleting employee: " + err.message, "error");
    } finally {
      setDeleteModalOpen(false);
      setEmployeeToDelete(null);
    }
  };

  // Derive unique filter options
  const departments = useMemo(() => {
    const set = new Set(employees.map((e) => e.department).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [employees]);

  const designations = useMemo(() => {
    const set = new Set(employees.map((e) => e.designation).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [employees]);

  const joiningYears = useMemo(() => {
    const set = new Set(
      employees
        .map((e) => e.dateOfJoining && e.dateOfJoining.substring(0, 4))
        .filter(Boolean)
    );
    return ["All", ...Array.from(set).sort()];
  }, [employees]);

  // Filtering & Sorting
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        searchQuery === "" ||
        emp.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.designation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.location?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDept = selectedDept === "All" || emp.department === selectedDept;
      const matchesStatus = selectedStatus === "All" || emp.status === selectedStatus;
      const matchesDesignation =
        selectedDesignation === "All" || emp.designation === selectedDesignation;
      const matchesYear =
        selectedYear === "All" ||
        (emp.dateOfJoining && emp.dateOfJoining.startsWith(selectedYear));

      return (
        matchesSearch &&
        matchesDept &&
        matchesStatus &&
        matchesDesignation &&
        matchesYear
      );
    });
  }, [
    employees,
    searchQuery,
    selectedDept,
    selectedStatus,
    selectedDesignation,
    selectedYear,
  ]);

  const sortedEmployees = useMemo(() => {
    const list = [...filteredEmployees];
    list.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = (bVal || "").toLowerCase();
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      aVal = aVal || 0;
      bVal = bVal || 0;
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    });
    return list;
  }, [filteredEmployees, sortField, sortDirection]);

  // Pagination calculation
  const totalPages = Math.ceil(sortedEmployees.length / pageSize) || 1;
  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedEmployees.slice(start, start + pageSize);
  }, [sortedEmployees, currentPage, pageSize]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedDept("All");
    setSelectedStatus("All");
    setSelectedDesignation("All");
    setSelectedYear("All");
    setCurrentPage(1);
  };

  // CSV Export functionality (Step 15)
  const exportToCSV = () => {
    if (sortedEmployees.length === 0) {
      showToast("No employee records to export", "warning");
      return;
    }

    const headers = [
      "Employee ID",
      "Name",
      "Email",
      "Phone",
      "Department",
      "Designation",
      "Location",
      "Date of Joining",
      "Salary (INR)",
      "Status",
      "Performance Score",
      "Performance Level",
    ];

    const rows = sortedEmployees.map((emp) => [
      `EMP-${emp.id}`,
      `"${(emp.name || "").replace(/"/g, '""')}"`,
      `"${(emp.email || "").replace(/"/g, '""')}"`,
      `"${(emp.phone || "").replace(/"/g, '""')}"`,
      `"${(emp.department || "").replace(/"/g, '""')}"`,
      `"${(emp.designation || "").replace(/"/g, '""')}"`,
      `"${(emp.location || "").replace(/"/g, '""')}"`,
      emp.dateOfJoining || "N/A",
      emp.salary || 0,
      emp.status || "Active",
      emp.performanceScore || 3,
      emp.performanceLevel || "Meets Expectations",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Employees_Export_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${sortedEmployees.length} employees to CSV`, "success");
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="opacity-50 ms-1" size={12} />;
    return sortDirection === "asc" ? (
      <FaSortUp className="text-primary ms-1" size={12} />
    ) : (
      <FaSortDown className="text-primary ms-1" size={12} />
    );
  };

  return (
    <div className="employees-page">
      {/* Top Header Actions */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold text-primary mb-1">Employee Directory</h4>
          <p className="text-muted small mb-0">
            Manage your company workforce, view profiles, and update employee records
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn-outline-custom"
            onClick={exportToCSV}
            title="Export filtered records to CSV"
          >
            <FaFileDownload /> Export CSV
          </button>
          <button
            type="button"
            className="btn-primary-custom"
            onClick={() => navigate("/add-employee")}
          >
            <FaUserPlus /> Add Employee
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="portal-card mb-4">
        <div className="row g-3">
          {/* Search box */}
          <div className="col-12 col-md-4">
            <div className="position-relative">
              <input
                type="text"
                className="form-control-custom ps-5"
                placeholder="Search by name, email, department, role..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <FaSearch
                className="position-absolute text-muted"
                style={{ left: "15px", top: "50%", transform: "translateY(-50%)" }}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="btn btn-link p-0 position-absolute text-muted"
                  style={{ right: "12px", top: "50%", transform: "translateY(-50%)" }}
                  onClick={() => setSearchQuery("")}
                >
                  <FaTimes size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Department Filter */}
          <div className="col-6 col-md-2">
            <select
              className="form-control-custom cursor-pointer"
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">All Depts</option>
              {departments
                .filter((d) => d !== "All")
                .map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="col-6 col-md-2">
            <select
              className="form-control-custom cursor-pointer"
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Designation Filter */}
          <div className="col-6 col-md-2">
            <select
              className="form-control-custom cursor-pointer"
              value={selectedDesignation}
              onChange={(e) => {
                setSelectedDesignation(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">All Roles</option>
              {designations
                .filter((d) => d !== "All")
                .map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
            </select>
          </div>

          {/* Joining Year Filter */}
          <div className="col-6 col-md-2 d-flex gap-2">
            <select
              className="form-control-custom cursor-pointer flex-grow-1"
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">All Years</option>
              {joiningYears
                .filter((y) => y !== "All")
                .map((y) => (
                  <option key={y} value={y}>
                    Joined {y}
                  </option>
                ))}
            </select>

            {(searchQuery ||
              selectedDept !== "All" ||
              selectedStatus !== "All" ||
              selectedDesignation !== "All" ||
              selectedYear !== "All") && (
              <button
                type="button"
                className="btn-outline-custom px-2"
                onClick={resetFilters}
                title="Reset all filters"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Employee Table */}
      <div className="portal-card p-0 overflow-hidden">
        {loading ? (
          <LoadingSpinner message="Fetching employee records..." />
        ) : sortedEmployees.length === 0 ? (
          <EmptyState
            title="No matching employees found"
            description="Try adjusting your search criteria or filter combinations."
            actionText="Clear Filters"
            onAction={resetFilters}
          />
        ) : (
          <div className="custom-table-container border-0">
            <table className="custom-table">
              <thead>
                <tr>
                  <th className="sortable" onClick={() => handleSort("id")}>
                    ID {getSortIcon("id")}
                  </th>
                  <th className="sortable" onClick={() => handleSort("name")}>
                    Employee {getSortIcon("name")}
                  </th>
                  <th className="sortable" onClick={() => handleSort("department")}>
                    Department {getSortIcon("department")}
                  </th>
                  <th>Designation</th>
                  <th>Location</th>
                  <th className="sortable" onClick={() => handleSort("dateOfJoining")}>
                    Joined {getSortIcon("dateOfJoining")}
                  </th>
                  <th className="sortable" onClick={() => handleSort("salary")}>
                    Salary {getSortIcon("salary")}
                  </th>
                  <th>Status</th>
                  <th className="sortable" onClick={() => handleSort("performanceScore")}>
                    Performance {getSortIcon("performanceScore")}
                  </th>
                  <th className="text-end" style={{ width: "130px" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.map((emp) => (
                  <tr key={emp.id}>
                    <td className="fw-semibold text-muted">#EMP-{emp.id}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <Avatar src={emp.avatarUrl} name={emp.name} size="sm" />
                        <div>
                          <div
                            className="fw-bold text-primary cursor-pointer text-decoration-none"
                            onClick={() => navigate(`/employees/${emp.id}`)}
                          >
                            {emp.name}
                          </div>
                          <div className="text-muted" style={{ fontSize: "0.76rem" }}>
                            {emp.email}
                          </div>
                          {emp.phone && (
                            <div className="text-muted" style={{ fontSize: "0.72rem" }}>
                              {emp.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge-pill-soft">{emp.department || "General"}</span>
                    </td>
                    <td className="small text-secondary">{emp.designation || "Specialist"}</td>
                    <td className="small text-muted">{emp.location || "Headquarters"}</td>
                    <td className="small text-muted">{emp.dateOfJoining || "2024-01-15"}</td>
                    <td className="small fw-semibold text-secondary">
                      ₹{(emp.salary || 65000).toLocaleString("en-IN")}
                    </td>
                    <td>
                      <Badge status={emp.status || "Active"} />
                    </td>
                    <td>
                      <div className="d-flex flex-column gap-1">
                        <StarRating score={emp.performanceScore || 3} size={12} />
                        <span className="text-muted" style={{ fontSize: "0.72rem" }}>
                          {emp.performanceLevel || "Meets Expectations"}
                        </span>
                      </div>
                    </td>
                    <td className="text-end">
                      <div className="d-inline-flex gap-1">
                        <button
                          type="button"
                          className="btn-action-icon view"
                          title="View Profile"
                          onClick={() => navigate(`/employees/${emp.id}`)}
                        >
                          <FaEye />
                        </button>
                        <button
                          type="button"
                          className="btn-action-icon edit"
                          title="Edit Employee"
                          onClick={() => navigate(`/edit-employee/${emp.id}`)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          type="button"
                          className="btn-action-icon delete"
                          title="Delete Employee"
                          onClick={() => handleDeleteClick(emp)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Footer with Pagination */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center p-3 border-top gap-3">
          <div className="d-flex align-items-center gap-2 small text-muted">
            <span>Show</span>
            <select
              className="form-select form-select-sm"
              style={{ width: "70px" }}
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <span>of {sortedEmployees.length} employees</span>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-outline-custom btn-sm px-3"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>

            <span className="small text-muted px-2">
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              className="btn btn-outline-custom btn-sm px-3"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Confirm Employee Deletion"
        message={`Are you sure you want to permanently delete employee "${employeeToDelete?.name}" (ID: #EMP-${employeeToDelete?.id})? This will also remove associated records.`}
        confirmText="Yes, Delete Employee"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setEmployeeToDelete(null);
        }}
      />
    </div>
  );
}
