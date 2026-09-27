import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import LoadingSpinner from "../components/Common/LoadingSpinner";

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    location: "",
    dateOfJoining: "",
    salary: "",
    status: "Active",
    performanceScore: 4,
    reportingManager: "",
    managerFeedback: "",
    avatarUrl: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    setLoading(true);
    try {
      const data = await api.getEmployeeById(id);
      if (!data) {
        showToast("Employee not found", "error");
        navigate("/employees");
        return;
      }
      setFormData({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        department: data.department || "Engineering",
        designation: data.designation || "",
        location: data.location || "Chennai",
        dateOfJoining: data.dateOfJoining || "2023-01-15",
        salary: data.salary || "",
        status: data.status || "Active",
        performanceScore: data.performanceScore || 4,
        reportingManager: data.reportingManager || "",
        managerFeedback: data.managerFeedback || "",
        avatarUrl: data.avatarUrl || "",
      });
    } catch (err) {
      showToast("Error loading employee details: " + err.message, "error");
      navigate("/employees");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.phone && !/^[0-9+\-\s()]{7,18}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.department.trim()) {
      newErrors.department = "Department is required";
    }

    if (!formData.designation.trim()) {
      newErrors.designation = "Job designation is required";
    }

    if (!formData.salary || Number(formData.salary) <= 0) {
      newErrors.salary = "Salary must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast("Please fix the validation errors before submitting", "warning");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        salary: Number(formData.salary),
        performanceScore: Number(formData.performanceScore),
      };

      await api.updateEmployee(id, payload);
      showToast("Employee record updated successfully", "success");
      navigate(`/employees/${id}`);
    } catch (err) {
      console.error(err);
      showToast("Failed to update employee: " + err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading employee information..." size="lg" />;
  }

  return (
    <div className="edit-employee-page" style={{ maxWidth: "900px", margin: "0 auto" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold text-primary mb-1">Edit Employee Profile</h4>
          <p className="text-muted small mb-0">Update employee details, role, or compensation</p>
        </div>
        <button
          type="button"
          className="btn-outline-custom"
          onClick={() => navigate(`/employees/${id}`)}
        >
          <FaArrowLeft /> Cancel
        </button>
      </div>

      <div className="portal-card">
        <form onSubmit={handleSubmit} noValidate>
          {/* Section 1: Personal Info */}
          <div className="mb-4">
            <h6 className="fw-bold text-primary border-bottom pb-2 mb-3">
              1. Personal Information
            </h6>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label-custom">
                  Full Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className={`form-control-custom ${errors.name ? "is-invalid border-danger" : ""}`}
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                {errors.name && <div className="text-danger small mt-1">{errors.name}</div>}
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label-custom">
                  Email Address <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  className={`form-control-custom ${errors.email ? "is-invalid border-danger" : ""}`}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label-custom">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  className={`form-control-custom ${errors.phone ? "is-invalid border-danger" : ""}`}
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && <div className="text-danger small mt-1">{errors.phone}</div>}
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label-custom">Work Location</label>
                <input
                  type="text"
                  name="location"
                  className="form-control-custom"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Employment Details */}
          <div className="mb-4">
            <h6 className="fw-bold text-primary border-bottom pb-2 mb-3">
              2. Employment & Role Specifications
            </h6>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label-custom">
                  Department <span className="text-danger">*</span>
                </label>
                <select
                  name="department"
                  className="form-control-custom"
                  value={formData.department}
                  onChange={handleChange}
                  required
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Quality Assurance">Quality Assurance</option>
                  <option value="Product & Design">Product & Design</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Operations & Support">Operations & Support</option>
                </select>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label-custom">
                  Designation / Title <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="designation"
                  className={`form-control-custom ${errors.designation ? "is-invalid border-danger" : ""}`}
                  value={formData.designation}
                  onChange={handleChange}
                  required
                />
                {errors.designation && (
                  <div className="text-danger small mt-1">{errors.designation}</div>
                )}
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label-custom">Date of Joining</label>
                <input
                  type="date"
                  name="dateOfJoining"
                  className="form-control-custom"
                  value={formData.dateOfJoining}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label-custom">Employment Status</label>
                <select
                  name="status"
                  className="form-control-custom"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label-custom">Reporting Manager</label>
                <input
                  type="text"
                  name="reportingManager"
                  className="form-control-custom"
                  value={formData.reportingManager}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label-custom">
                  Monthly Compensation (INR) <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  name="salary"
                  min="0"
                  className={`form-control-custom ${errors.salary ? "is-invalid border-danger" : ""}`}
                  value={formData.salary}
                  onChange={handleChange}
                  required
                />
                {errors.salary && <div className="text-danger small mt-1">{errors.salary}</div>}
              </div>
            </div>
          </div>

          {/* Section 3: Performance Review */}
          <div className="mb-4">
            <h6 className="fw-bold text-primary border-bottom pb-2 mb-3">
              3. Performance Rating & Feedback
            </h6>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label-custom">Performance Rating (1 - 5)</label>
                <select
                  name="performanceScore"
                  className="form-control-custom"
                  value={formData.performanceScore}
                  onChange={handleChange}
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Very Good</option>
                  <option value={3}>3 - Meets Expectations</option>
                  <option value={2}>2 - Developing</option>
                  <option value={1}>1 - Needs Improvement</option>
                </select>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label-custom">Manager Feedback</label>
                <input
                  type="text"
                  name="managerFeedback"
                  className="form-control-custom"
                  value={formData.managerFeedback}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="d-flex justify-content-end gap-3 pt-3 border-top">
            <button
              type="button"
              className="btn-outline-custom"
              onClick={() => navigate(`/employees/${id}`)}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary-custom"
              disabled={submitting}
            >
              <FaSave /> {submitting ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}