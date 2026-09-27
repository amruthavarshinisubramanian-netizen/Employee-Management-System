import { useState, useEffect } from "react";
import {
  FaCalendarCheck,
  FaCalendarPlus,
  FaCheck,
  FaTimes,
  FaTrash,
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import Badge from "../components/Common/Badge";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import EmptyState from "../components/Common/EmptyState";
import ConfirmModal from "../components/Common/ConfirmModal";

export default function LeaveManagement() {
  const { showToast } = useToast();

  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Apply Leave Modal
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyForm, setApplyForm] = useState({
    employeeId: "",
    leaveType: "Casual Leave",
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
    reason: "",
  });

  // Action review modal (Approve / Reject)
  const [reviewModal, setReviewModal] = useState({
    isOpen: false,
    leave: null,
    status: "",
    comments: "",
  });

  // Delete modal
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    leaveId: null,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [leavesRes, empsRes] = await Promise.all([
        api.getLeaves(),
        api.getEmployees(),
      ]);
      setLeaves(Array.isArray(leavesRes) ? leavesRes : []);
      setEmployees(Array.isArray(empsRes) ? empsRes : []);
      if (Array.isArray(empsRes) && empsRes.length > 0 && !applyForm.employeeId) {
        setApplyForm((prev) => ({ ...prev, employeeId: empsRes[0].id }));
      }
    } catch (err) {
      console.error(err);
      showToast("Error loading leave management data: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    if (!applyForm.reason.trim()) {
      showToast("Please provide a reason for the leave request", "warning");
      return;
    }
    if (new Date(applyForm.startDate) > new Date(applyForm.endDate)) {
      showToast("Start date cannot be after end date", "warning");
      return;
    }

    try {
      const emp = employees.find((x) => String(x.id) === String(applyForm.employeeId));
      const payload = {
        employeeId: Number(applyForm.employeeId),
        employeeName: emp ? emp.name : "Employee",
        department: emp ? emp.department : "General",
        leaveType: applyForm.leaveType,
        startDate: applyForm.startDate,
        endDate: applyForm.endDate,
        reason: applyForm.reason,
      };

      const saved = await api.applyLeave(payload);
      setLeaves((prev) => [saved, ...prev]);
      showToast("Leave request submitted successfully", "success");
      setShowApplyModal(false);
      setApplyForm({
        employeeId: employees[0]?.id || "",
        leaveType: "Casual Leave",
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date().toISOString().slice(0, 10),
        reason: "",
      });
    } catch (err) {
      showToast("Failed to submit leave request: " + err.message, "error");
    }
  };

  const handleReviewSubmit = async () => {
    if (!reviewModal.leave) return;
    try {
      const updated = await api.updateLeaveStatus(
        reviewModal.leave.id,
        reviewModal.status,
        reviewModal.comments
      );
      setLeaves((prev) =>
        prev.map((l) => (l.id === reviewModal.leave.id ? updated : l))
      );
      showToast(
        `Leave request #${reviewModal.leave.id} was ${reviewModal.status.toLowerCase()}`,
        "success"
      );
    } catch (err) {
      showToast("Failed to update status: " + err.message, "error");
    } finally {
      setReviewModal({ isOpen: false, leave: null, status: "", comments: "" });
    }
  };

  const handleDeleteLeave = async () => {
    if (!deleteModal.leaveId) return;
    try {
      await api.deleteLeave(deleteModal.leaveId);
      setLeaves((prev) => prev.filter((l) => l.id !== deleteModal.leaveId));
      showToast("Leave record deleted", "success");
    } catch (err) {
      showToast("Failed to delete leave: " + err.message, "error");
    } finally {
      setDeleteModal({ isOpen: false, leaveId: null });
    }
  };

  const pendingCount = leaves.filter((l) => l.status === "Pending").length;
  const approvedCount = leaves.filter((l) => l.status === "Approved").length;
  const rejectedCount = leaves.filter((l) => l.status === "Rejected").length;

  return (
    <div className="leaves-page">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold text-primary mb-1">Leave Management</h4>
          <p className="text-muted small mb-0">
            Track employee time-off requests, approve or reject applications, and maintain leave history
          </p>
        </div>

        <button
          type="button"
          className="btn-primary-custom"
          onClick={() => setShowApplyModal(true)}
        >
          <FaCalendarPlus /> Apply for Leave
        </button>
      </div>

      {/* KPI Stats */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="kpi-card">
            <div className="kpi-info">
              <h6>Pending Requests</h6>
              <h3 className="text-warning">{pendingCount}</h3>
              <div className="kpi-subtext">Awaiting Manager Review</div>
            </div>
            <div className="kpi-icon-box kpi-amber">
              <FaHourglassHalf />
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="kpi-card">
            <div className="kpi-info">
              <h6>Approved Absences</h6>
              <h3 className="text-success">{approvedCount}</h3>
              <div className="kpi-subtext">Authorized Leaves</div>
            </div>
            <div className="kpi-icon-box kpi-green">
              <FaCheckCircle />
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="kpi-card">
            <div className="kpi-info">
              <h6>Rejected Requests</h6>
              <h3 className="text-danger">{rejectedCount}</h3>
              <div className="kpi-subtext">Disallowed Applications</div>
            </div>
            <div className="kpi-icon-box kpi-gray">
              <FaTimesCircle />
            </div>
          </div>
        </div>
      </div>

      {/* Leaves Table */}
      <div className="portal-card p-0 overflow-hidden">
        {loading ? (
          <LoadingSpinner message="Fetching leave applications..." />
        ) : leaves.length === 0 ? (
          <EmptyState
            title="No leave requests found"
            description="All employees are currently on active schedule. Submit a request using the button above."
            actionText="Apply for Leave"
            onAction={() => setShowApplyModal(true)}
          />
        ) : (
          <div className="custom-table-container border-0">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Req #</th>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Leave Type</th>
                  <th>Duration</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Review Comments</th>
                  <th className="text-end" style={{ width: "140px" }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave.id}>
                    <td className="fw-semibold text-muted">#LV-{leave.id}</td>
                    <td>
                      <div className="fw-bold text-primary">{leave.employeeName}</div>
                      <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                        ID #{leave.employeeId}
                      </div>
                    </td>
                    <td>
                      <span className="badge-pill-soft">{leave.department || "General"}</span>
                    </td>
                    <td>
                      <span className="fw-semibold small">{leave.leaveType}</span>
                    </td>
                    <td>
                      <div className="small text-secondary">
                        {leave.startDate} &rarr; {leave.endDate}
                      </div>
                      <div className="text-muted" style={{ fontSize: "0.72rem" }}>
                        Applied: {leave.appliedDate || "Recent"}
                      </div>
                    </td>
                    <td>
                      <p
                        className="small text-muted mb-0 text-truncate"
                        style={{ maxWidth: "220px" }}
                        title={leave.reason}
                      >
                        {leave.reason}
                      </p>
                    </td>
                    <td>
                      <Badge status={leave.status} />
                    </td>
                    <td>
                      <span className="small text-muted fst-italic">
                        {leave.reviewComments || "—"}
                      </span>
                    </td>
                    <td className="text-end">
                      {leave.status === "Pending" ? (
                        <div className="d-inline-flex gap-1">
                          <button
                            type="button"
                            className="btn btn-sm btn-success py-1 px-2 d-flex align-items-center gap-1"
                            title="Approve Leave"
                            onClick={() =>
                              setReviewModal({
                                isOpen: true,
                                leave,
                                status: "Approved",
                                comments: "Approved by HR Admin.",
                              })
                            }
                          >
                            <FaCheck size={11} /> Approve
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger py-1 px-2 d-flex align-items-center gap-1"
                            title="Reject Leave"
                            onClick={() =>
                              setReviewModal({
                                isOpen: true,
                                leave,
                                status: "Rejected",
                                comments: "Capacity constraints during sprint release.",
                              })
                            }
                          >
                            <FaTimes size={11} /> Reject
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="btn-action-icon delete"
                          title="Delete Request"
                          onClick={() => setDeleteModal({ isOpen: true, leaveId: leave.id })}
                        >
                          <FaTrash />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <div className="modal-overlay" onClick={() => setShowApplyModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5 className="modal-title">Apply for Employee Leave</h5>
              <button
                type="button"
                className="btn-action-icon"
                onClick={() => setShowApplyModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleApplyLeave}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label-custom">Select Employee</label>
                  <select
                    className="form-control-custom"
                    value={applyForm.employeeId}
                    onChange={(e) =>
                      setApplyForm({ ...applyForm, employeeId: e.target.value })
                    }
                    required
                  >
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} ({emp.department} - #{emp.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label-custom">Leave Category</label>
                  <select
                    className="form-control-custom"
                    value={applyForm.leaveType}
                    onChange={(e) =>
                      setApplyForm({ ...applyForm, leaveType: e.target.value })
                    }
                  >
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Personal Leave">Personal Leave</option>
                  </select>
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label-custom">Start Date</label>
                    <input
                      type="date"
                      className="form-control-custom"
                      value={applyForm.startDate}
                      onChange={(e) =>
                        setApplyForm({ ...applyForm, startDate: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label-custom">End Date</label>
                    <input
                      type="date"
                      className="form-control-custom"
                      value={applyForm.endDate}
                      onChange={(e) =>
                        setApplyForm({ ...applyForm, endDate: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label-custom">Reason for Leave</label>
                  <textarea
                    rows={3}
                    className="form-control-custom"
                    placeholder="Provide detailed reason for absence..."
                    value={applyForm.reason}
                    onChange={(e) =>
                      setApplyForm({ ...applyForm, reason: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-outline-custom"
                  onClick={() => setShowApplyModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary-custom">
                  Submit Leave Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal (Approve / Reject) */}
      {reviewModal.isOpen && (
        <div
          className="modal-overlay"
          onClick={() => setReviewModal({ isOpen: false, leave: null, status: "", comments: "" })}
        >
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5 className="modal-title">
                {reviewModal.status === "Approved" ? "Approve" : "Reject"} Leave Request #
                {reviewModal.leave?.id}
              </h5>
              <button
                type="button"
                className="btn-action-icon"
                onClick={() =>
                  setReviewModal({ isOpen: false, leave: null, status: "", comments: "" })
                }
              >
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <p className="small text-secondary mb-3">
                You are updating the request for{" "}
                <strong>{reviewModal.leave?.employeeName}</strong> (
                {reviewModal.leave?.leaveType}: {reviewModal.leave?.startDate} to{" "}
                {reviewModal.leave?.endDate}).
              </p>
              <div className="mb-3">
                <label className="form-label-custom">HR Review Comments</label>
                <textarea
                  rows={3}
                  className="form-control-custom"
                  value={reviewModal.comments}
                  onChange={(e) =>
                    setReviewModal((prev) => ({ ...prev, comments: e.target.value }))
                  }
                  placeholder="Add optional notes for the employee..."
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn-outline-custom"
                onClick={() =>
                  setReviewModal({ isOpen: false, leave: null, status: "", comments: "" })
                }
              >
                Cancel
              </button>
              <button
                type="button"
                className={`btn ${
                  reviewModal.status === "Approved" ? "btn-success" : "btn-danger"
                } px-3 py-2 rounded-3`}
                onClick={handleReviewSubmit}
              >
                Confirm {reviewModal.status}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Leave Application"
        message="Are you sure you want to permanently remove this leave record from the audit log?"
        confirmText="Yes, Delete"
        confirmVariant="danger"
        onConfirm={handleDeleteLeave}
        onCancel={() => setDeleteModal({ isOpen: false, leaveId: null })}
      />
    </div>
  );
}
