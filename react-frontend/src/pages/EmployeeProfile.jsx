import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaEdit,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaUserTie,
  FaPlus,
  FaTrash,
  FaStar,
  FaBullseye,
  FaHistory,
  FaCode,
  FaCheckCircle,
  FaTimes,
  FaSave,
} from "react-icons/fa";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import Avatar from "../components/Common/Avatar";
import Badge from "../components/Common/Badge";
import StarRating from "../components/Common/StarRating";
import ProgressBar from "../components/Common/ProgressBar";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import ConfirmModal from "../components/Common/ConfirmModal";

export default function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState(null);
  const [skills, setSkills] = useState([]);
  const [goals, setGoals] = useState([]);
  const [careerHistory, setCareerHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  // Modals
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [newSkill, setNewSkill] = useState({ skillName: "", proficiencyLevel: 3 });

  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalForm, setGoalForm] = useState({
    title: "",
    description: "",
    startDate: new Date().toISOString().slice(0, 10),
    targetDate: "",
    progress: 0,
    status: "Not Started",
  });

  const [showCareerModal, setShowCareerModal] = useState(false);
  const [careerForm, setCareerForm] = useState({
    year: new Date().getFullYear().toString(),
    designation: "",
    department: "",
    description: "",
  });

  const [showPerfModal, setShowPerfModal] = useState(false);
  const [perfForm, setPerfForm] = useState({
    performanceScore: 4,
    managerFeedback: "",
    lastReviewDate: new Date().toISOString().slice(0, 10),
  });

  // Delete confirmations
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    type: "",
    id: null,
    title: "",
    message: "",
  });

  useEffect(() => {
    loadEmployeeData();
  }, [id]);

  const loadEmployeeData = async () => {
    setLoading(true);
    try {
      const [empData, skillsData, goalsData, careerData] = await Promise.all([
        api.getEmployeeById(id),
        api.getSkillsByEmployee(id),
        api.getGoalsByEmployee(id),
        api.getCareerByEmployee(id),
      ]);

      if (!empData) {
        showToast("Employee not found", "error");
        navigate("/employees");
        return;
      }

      setEmployee(empData);
      setSkills(Array.isArray(skillsData) ? skillsData : []);
      setGoals(Array.isArray(goalsData) ? goalsData : []);
      setCareerHistory(Array.isArray(careerData) ? careerData : []);

      setPerfForm({
        performanceScore: empData.performanceScore || 4,
        managerFeedback: empData.managerFeedback || "",
        lastReviewDate: empData.lastReviewDate || new Date().toISOString().slice(0, 10),
      });

      if (empData.department) {
        setCareerForm((prev) => ({ ...prev, department: empData.department }));
      }
    } catch (err) {
      console.error(err);
      showToast("Error loading employee profile: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Skill Matrix Handlers
  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.skillName.trim()) {
      showToast("Please enter a skill name", "warning");
      return;
    }
    try {
      const saved = await api.addSkill({
        employeeId: Number(id),
        skillName: newSkill.skillName.trim(),
        proficiencyLevel: Number(newSkill.proficiencyLevel),
      });
      setSkills((prev) => [...prev, saved]);
      showToast("Skill added to matrix", "success");
      setShowSkillModal(false);
      setNewSkill({ skillName: "", proficiencyLevel: 3 });
    } catch (err) {
      showToast("Failed to add skill: " + err.message, "error");
    }
  };

  const handleDeleteSkill = async (skillId) => {
    try {
      await api.deleteSkill(skillId);
      setSkills((prev) => prev.filter((s) => s.id !== skillId));
      showToast("Skill removed", "success");
    } catch (err) {
      showToast("Failed to delete skill: " + err.message, "error");
    }
  };

  // Goal Tracker Handlers
  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!goalForm.title.trim()) {
      showToast("Goal title is required", "warning");
      return;
    }
    try {
      const saved = await api.addGoal({
        employeeId: Number(id),
        title: goalForm.title,
        description: goalForm.description,
        startDate: goalForm.startDate,
        targetDate: goalForm.targetDate,
        progress: Number(goalForm.progress),
        status: Number(goalForm.progress) >= 100 ? "Completed" : goalForm.status,
      });
      setGoals((prev) => [...prev, saved]);
      showToast("Goal created successfully", "success");
      setShowGoalModal(false);
      setGoalForm({
        title: "",
        description: "",
        startDate: new Date().toISOString().slice(0, 10),
        targetDate: "",
        progress: 0,
        status: "Not Started",
      });
    } catch (err) {
      showToast("Failed to add goal: " + err.message, "error");
    }
  };

  const handleUpdateGoalProgress = async (goal, newProgress) => {
    try {
      const updatedStatus = newProgress >= 100 ? "Completed" : newProgress > 0 ? "In Progress" : "Not Started";
      const updated = await api.updateGoal(goal.id, {
        ...goal,
        progress: newProgress,
        status: updatedStatus,
      });
      setGoals((prev) => prev.map((g) => (g.id === goal.id ? updated : g)));
      showToast("Goal progress updated", "success");
    } catch (err) {
      showToast("Failed to update goal: " + err.message, "error");
    }
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      await api.deleteGoal(goalId);
      setGoals((prev) => prev.filter((g) => g.id !== goalId));
      showToast("Goal deleted", "success");
    } catch (err) {
      showToast("Failed to delete goal: " + err.message, "error");
    }
  };

  // Career Growth Timeline Handlers
  const handleAddCareer = async (e) => {
    e.preventDefault();
    if (!careerForm.designation.trim()) {
      showToast("Designation is required", "warning");
      return;
    }
    try {
      const saved = await api.addCareerEntry({
        employeeId: Number(id),
        year: careerForm.year,
        designation: careerForm.designation,
        department: careerForm.department || employee?.department,
        description: careerForm.description,
      });
      setCareerHistory((prev) => [...prev, saved]);
      showToast("Career milestone added", "success");
      setShowCareerModal(false);
      setCareerForm({
        year: new Date().getFullYear().toString(),
        designation: "",
        department: employee?.department || "",
        description: "",
      });
    } catch (err) {
      showToast("Failed to add milestone: " + err.message, "error");
    }
  };

  const handleDeleteCareer = async (careerId) => {
    try {
      await api.deleteCareerEntry(careerId);
      setCareerHistory((prev) => prev.filter((c) => c.id !== careerId));
      showToast("Timeline entry deleted", "success");
    } catch (err) {
      showToast("Failed to delete entry: " + err.message, "error");
    }
  };

  // Performance Review Handler
  const handleUpdatePerformance = async (e) => {
    e.preventDefault();
    try {
      const updated = await api.updateEmployee(id, {
        ...employee,
        performanceScore: Number(perfForm.performanceScore),
        managerFeedback: perfForm.managerFeedback,
        lastReviewDate: perfForm.lastReviewDate,
      });
      setEmployee(updated);
      showToast("Performance review recorded successfully", "success");
      setShowPerfModal(false);
    } catch (err) {
      showToast("Failed to update performance: " + err.message, "error");
    }
  };

  const getSkillLevelLabel = (lvl) => {
    switch (Number(lvl)) {
      case 1: return "Beginner (1/5)";
      case 2: return "Basic (2/5)";
      case 3: return "Intermediate (3/5)";
      case 4: return "Advanced (4/5)";
      case 5: return "Expert (5/5)";
      default: return "Intermediate";
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading employee profile..." size="lg" />;
  }

  if (!employee) return null;

  return (
    <div className="employee-profile-page">
      {/* Top Navigation Back */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button
          type="button"
          className="btn-outline-custom"
          onClick={() => navigate("/employees")}
        >
          <FaArrowLeft /> Back to Directory
        </button>

        <button
          type="button"
          className="btn-primary-custom"
          onClick={() => navigate(`/edit-employee/${id}`)}
        >
          <FaEdit /> Edit Profile
        </button>
      </div>

      {/* Main Profile Header Card */}
      <div className="portal-card mb-4">
        <div className="d-flex flex-column flex-md-row align-items-md-center gap-4">
          <Avatar
            src={employee.avatarUrl}
            name={employee.name}
            size="xl"
            className="border border-3 border-primary shadow"
          />

          <div className="flex-grow-1">
            <div className="d-flex flex-wrap align-items-center gap-3 mb-1">
              <h3 className="fw-bold text-primary mb-0">{employee.name}</h3>
              <Badge status={employee.status || "Active"} />
              <span className="badge-pill-soft">#EMP-{employee.id}</span>
            </div>

            <p className="text-secondary fw-semibold mb-2">
              {employee.designation || "Software Specialist"} &bull;{" "}
              <span className="text-muted">{employee.department || "Engineering"}</span>
            </p>

            <div className="d-flex flex-wrap gap-4 text-muted small mt-2">
              <span className="d-flex align-items-center gap-2">
                <FaEnvelope className="text-primary" /> {employee.email}
              </span>
              {employee.phone && (
                <span className="d-flex align-items-center gap-2">
                  <FaPhone className="text-primary" /> {employee.phone}
                </span>
              )}
              {employee.location && (
                <span className="d-flex align-items-center gap-2">
                  <FaMapMarkerAlt className="text-primary" /> {employee.location}
                </span>
              )}
            </div>
          </div>

          {/* Quick Performance Badge */}
          <div className="d-flex flex-column align-items-md-end p-3 rounded-3 bg-light bg-opacity-50 border">
            <span className="text-muted small fw-semibold text-uppercase">Performance Rating</span>
            <div className="d-flex align-items-center gap-2 my-1">
              <span className="fs-4 fw-bold text-primary">{employee.performanceScore || 3}.0</span>
              <StarRating score={employee.performanceScore || 3} size={16} />
            </div>
            <span className="small fw-semibold text-secondary">
              {employee.performanceLevel || "Meets Expectations"}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="d-flex gap-2 mb-4 border-bottom pb-2 overflow-x-auto">
        {[
          { key: "overview", label: "Overview & Work Info" },
          { key: "skills", label: `Skill Matrix (${skills.length})` },
          { key: "goals", label: `Goal Tracker (${goals.length})` },
          { key: "career", label: `Career Timeline (${careerHistory.length})` },
          { key: "performance", label: "Performance Review" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`btn btn-sm ${
              activeTab === tab.key ? "btn-primary-custom" : "btn-outline-custom"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview & Work Info */}
      {activeTab === "overview" && (
        <div className="row g-4">
          {/* Personal Info */}
          <div className="col-12 col-md-6">
            <div className="portal-card h-100">
              <h5 className="card-title mb-4">
                <FaUserTie className="text-primary" /> Personal Information
              </h5>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex justify-content-between border-bottom pb-2">
                  <span className="text-muted small">Full Name</span>
                  <span className="fw-semibold small">{employee.name}</span>
                </div>
                <div className="d-flex justify-content-between border-bottom pb-2">
                  <span className="text-muted small">Employee ID</span>
                  <span className="fw-semibold small">#EMP-{employee.id}</span>
                </div>
                <div className="d-flex justify-content-between border-bottom pb-2">
                  <span className="text-muted small">Email Address</span>
                  <span className="fw-semibold small">{employee.email}</span>
                </div>
                <div className="d-flex justify-content-between border-bottom pb-2">
                  <span className="text-muted small">Phone Number</span>
                  <span className="fw-semibold small">{employee.phone || "Not Specified"}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted small">Work Location</span>
                  <span className="fw-semibold small">{employee.location || "Chennai, India"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Work Info */}
          <div className="col-12 col-md-6">
            <div className="portal-card h-100">
              <h5 className="card-title mb-4">
                <FaCalendarAlt className="text-primary" /> Employment Details
              </h5>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex justify-content-between border-bottom pb-2">
                  <span className="text-muted small">Department</span>
                  <span className="badge-pill-soft">{employee.department}</span>
                </div>
                <div className="d-flex justify-content-between border-bottom pb-2">
                  <span className="text-muted small">Designation</span>
                  <span className="fw-semibold small">{employee.designation || "Staff"}</span>
                </div>
                <div className="d-flex justify-content-between border-bottom pb-2">
                  <span className="text-muted small">Date of Joining</span>
                  <span className="fw-semibold small">{employee.dateOfJoining || "2023-01-15"}</span>
                </div>
                <div className="d-flex justify-content-between border-bottom pb-2">
                  <span className="text-muted small">Annual Compensation</span>
                  <span className="fw-bold small text-success">
                    ₹{(employee.salary || 65000).toLocaleString("en-IN")} / mo
                  </span>
                </div>
                <div className="d-flex justify-content-between border-bottom pb-2">
                  <span className="text-muted small">Reporting Manager</span>
                  <span className="fw-semibold small">
                    {employee.reportingManager || "Kavitha Raman (VP Engineering)"}
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted small">Employment Status</span>
                  <Badge status={employee.status || "Active"} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Skill Matrix (Unique Feature - Step 6) */}
      {activeTab === "skills" && (
        <div className="portal-card">
          <div className="card-header-flex">
            <div>
              <h5 className="card-title">
                <FaCode className="text-primary" /> Technical & Professional Skill Matrix
              </h5>
              <p className="text-muted small mb-0">
                Visual proficiency mapping: 1 = Beginner, 2 = Basic, 3 = Intermediate, 4 = Advanced, 5 = Expert
              </p>
            </div>
            <button
              type="button"
              className="btn-primary-custom"
              onClick={() => setShowSkillModal(true)}
            >
              <FaPlus /> Add Skill
            </button>
          </div>

          {skills.length === 0 ? (
            <div className="text-center py-4 text-muted small">
              No skills added to this profile yet. Click "Add Skill" to evaluate.
            </div>
          ) : (
            <div className="row g-3">
              {skills.map((skill) => (
                <div key={skill.id} className="col-12 col-md-6">
                  <div className="p-3 border rounded-3 bg-light bg-opacity-25">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-bold text-primary">{skill.skillName}</span>
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge-pill-soft">{getSkillLevelLabel(skill.proficiencyLevel)}</span>
                        <button
                          type="button"
                          className="btn-action-icon delete"
                          onClick={() => handleDeleteSkill(skill.id)}
                          title="Remove skill"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </div>
                    <ProgressBar
                      value={skill.proficiencyLevel}
                      max={5}
                      height={10}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Goal Tracker (Unique Feature - Step 8) */}
      {activeTab === "goals" && (
        <div className="portal-card">
          <div className="card-header-flex">
            <div>
              <h5 className="card-title">
                <FaBullseye className="text-primary" /> Employee Goal Tracker
              </h5>
              <p className="text-muted small mb-0">
                Manage development targets, quarterly OKRs, and professional certifications
              </p>
            </div>
            <button
              type="button"
              className="btn-primary-custom"
              onClick={() => setShowGoalModal(true)}
            >
              <FaPlus /> Set New Goal
            </button>
          </div>

          {goals.length === 0 ? (
            <div className="text-center py-4 text-muted small">
              No goals set for this employee. Click "Set New Goal" to begin tracking.
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {goals.map((goal) => (
                <div key={goal.id} className="p-3 border rounded-3 bg-light bg-opacity-25">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-2 mb-2">
                    <div>
                      <div className="d-flex align-items-center gap-2">
                        <h6 className="fw-bold text-primary mb-0">{goal.title}</h6>
                        <span
                          className={`badge ${
                            goal.status === "Completed"
                              ? "bg-success"
                              : goal.status === "In Progress"
                              ? "bg-primary"
                              : "bg-secondary"
                          }`}
                        >
                          {goal.status}
                        </span>
                      </div>
                      <p className="text-muted small mb-1 mt-1">{goal.description}</p>
                      <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                        Timeline: {goal.startDate || "Ongoing"} &rarr; {goal.targetDate || "Q4 2026"}
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <select
                        className="form-select form-select-sm"
                        style={{ width: "120px" }}
                        value={goal.progress}
                        onChange={(e) => handleUpdateGoalProgress(goal, Number(e.target.value))}
                      >
                        <option value={0}>0% (Not Started)</option>
                        <option value={25}>25% Progress</option>
                        <option value={50}>50% Progress</option>
                        <option value={75}>75% Progress</option>
                        <option value={100}>100% (Completed)</option>
                      </select>
                      <button
                        type="button"
                        className="btn-action-icon delete"
                        onClick={() => handleDeleteGoal(goal.id)}
                        title="Delete Goal"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </div>

                  <ProgressBar value={goal.progress} max={100} height={8} showLabel={true} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Career Growth Timeline (Unique Feature - Step 9) */}
      {activeTab === "career" && (
        <div className="portal-card">
          <div className="card-header-flex">
            <div>
              <h5 className="card-title">
                <FaHistory className="text-primary" /> Career Growth Timeline
              </h5>
              <p className="text-muted small mb-0">
                Visual history of promotions, department transitions, and key organizational achievements
              </p>
            </div>
            <button
              type="button"
              className="btn-primary-custom"
              onClick={() => setShowCareerModal(true)}
            >
              <FaPlus /> Add Milestone
            </button>
          </div>

          {careerHistory.length === 0 ? (
            <div className="text-center py-4 text-muted small">
              No career milestones recorded. Add previous roles or promotions above.
            </div>
          ) : (
            <div className="growth-timeline mt-3">
              {careerHistory.map((item) => (
                <div key={item.id} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-card">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="badge bg-primary text-white fw-bold">{item.year}</span>
                      <button
                        type="button"
                        className="btn-action-icon delete"
                        onClick={() => handleDeleteCareer(item.id)}
                        title="Remove milestone"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                    <h6 className="fw-bold text-primary mb-1">{item.designation}</h6>
                    <div className="text-muted small mb-2">{item.department}</div>
                    <p className="text-secondary small mb-0">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Performance Review (Step 7) */}
      {activeTab === "performance" && (
        <div className="portal-card">
          <div className="card-header-flex">
            <div>
              <h5 className="card-title">
                <FaStar className="text-warning" /> Annual Performance Management
              </h5>
              <p className="text-muted small mb-0">
                Standardized 1-5 rating system with formal manager feedback and review history
              </p>
            </div>
            <button
              type="button"
              className="btn-primary-custom"
              onClick={() => setShowPerfModal(true)}
            >
              <FaEdit /> Update Review
            </button>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-5">
              <div className="p-4 border rounded-3 bg-light bg-opacity-25 text-center">
                <span className="text-muted small fw-bold text-uppercase">Current Rating</span>
                <div className="display-4 fw-bold text-primary my-2">
                  {employee.performanceScore || 3}.0
                </div>
                <div className="d-flex justify-content-center mb-2">
                  <StarRating score={employee.performanceScore || 3} size={22} />
                </div>
                <h6 className="fw-bold text-secondary mb-1">
                  {employee.performanceLevel || "Meets Expectations"}
                </h6>
                <p className="text-muted small mb-0">
                  Last Evaluated on {employee.lastReviewDate || "2026-08-15"}
                </p>
              </div>
            </div>

            <div className="col-12 col-md-7">
              <div className="p-4 border rounded-3 bg-light bg-opacity-25 h-100 d-flex flex-column justify-content-between">
                <div>
                  <h6 className="fw-bold text-primary mb-2">Manager Feedback & Evaluation</h6>
                  <p className="text-secondary fst-italic mb-3">
                    "{employee.managerFeedback || "Demonstrates consistent performance, high technical acumen, and good team collaboration."}"
                  </p>
                </div>
                <div className="border-top pt-3 text-muted small">
                  <strong>Reviewer:</strong> {employee.reportingManager || "Kavitha Raman (VP Engineering)"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Skill Modal */}
      {showSkillModal && (
        <div className="modal-overlay" onClick={() => setShowSkillModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5 className="modal-title">Add Skill to Matrix</h5>
              <button
                type="button"
                className="btn-action-icon"
                onClick={() => setShowSkillModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleAddSkill}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label-custom">Skill Name</label>
                  <input
                    type="text"
                    className="form-control-custom"
                    placeholder="e.g. Java, React, Docker, Spring Boot"
                    value={newSkill.skillName}
                    onChange={(e) => setNewSkill({ ...newSkill, skillName: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label-custom">Proficiency Level</label>
                  <select
                    className="form-control-custom"
                    value={newSkill.proficiencyLevel}
                    onChange={(e) =>
                      setNewSkill({ ...newSkill, proficiencyLevel: Number(e.target.value) })
                    }
                  >
                    <option value={1}>1 - Beginner</option>
                    <option value={2}>2 - Basic</option>
                    <option value={3}>3 - Intermediate</option>
                    <option value={4}>4 - Advanced</option>
                    <option value={5}>5 - Expert</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-outline-custom"
                  onClick={() => setShowSkillModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary-custom">
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Goal Modal */}
      {showGoalModal && (
        <div className="modal-overlay" onClick={() => setShowGoalModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5 className="modal-title">Set Professional Goal</h5>
              <button
                type="button"
                className="btn-action-icon"
                onClick={() => setShowGoalModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleAddGoal}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label-custom">Goal Title</label>
                  <input
                    type="text"
                    className="form-control-custom"
                    placeholder="e.g. Complete Spring Boot Microservices Upgrade"
                    value={goalForm.title}
                    onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label-custom">Description & Deliverables</label>
                  <textarea
                    rows={3}
                    className="form-control-custom"
                    placeholder="Describe specific milestones and outcomes..."
                    value={goalForm.description}
                    onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
                  />
                </div>
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label-custom">Start Date</label>
                    <input
                      type="date"
                      className="form-control-custom"
                      value={goalForm.startDate}
                      onChange={(e) => setGoalForm({ ...goalForm, startDate: e.target.value })}
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label-custom">Target Completion Date</label>
                    <input
                      type="date"
                      className="form-control-custom"
                      value={goalForm.targetDate}
                      onChange={(e) => setGoalForm({ ...goalForm, targetDate: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label-custom">Initial Progress (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    className="form-control-custom"
                    value={goalForm.progress}
                    onChange={(e) =>
                      setGoalForm({ ...goalForm, progress: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-outline-custom"
                  onClick={() => setShowGoalModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary-custom">
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Career Milestone Modal */}
      {showCareerModal && (
        <div className="modal-overlay" onClick={() => setShowCareerModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5 className="modal-title">Add Career Milestone</h5>
              <button
                type="button"
                className="btn-action-icon"
                onClick={() => setShowCareerModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleAddCareer}>
              <div className="modal-body">
                <div className="row g-2 mb-3">
                  <div className="col-4">
                    <label className="form-label-custom">Year</label>
                    <input
                      type="text"
                      className="form-control-custom"
                      placeholder="e.g. 2024"
                      value={careerForm.year}
                      onChange={(e) => setCareerForm({ ...careerForm, year: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-8">
                    <label className="form-label-custom">Designation / Role</label>
                    <input
                      type="text"
                      className="form-control-custom"
                      placeholder="e.g. Senior Software Engineer"
                      value={careerForm.designation}
                      onChange={(e) =>
                        setCareerForm({ ...careerForm, designation: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label-custom">Department</label>
                  <input
                    type="text"
                    className="form-control-custom"
                    value={careerForm.department}
                    onChange={(e) =>
                      setCareerForm({ ...careerForm, department: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label-custom">Summary / Responsibilities</label>
                  <textarea
                    rows={3}
                    className="form-control-custom"
                    placeholder="Describe achievements or scope of role..."
                    value={careerForm.description}
                    onChange={(e) =>
                      setCareerForm({ ...careerForm, description: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-outline-custom"
                  onClick={() => setShowCareerModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary-custom">
                  Add Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Performance Review Modal */}
      {showPerfModal && (
        <div className="modal-overlay" onClick={() => setShowPerfModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5 className="modal-title">Record Performance Evaluation</h5>
              <button
                type="button"
                className="btn-action-icon"
                onClick={() => setShowPerfModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleUpdatePerformance}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label-custom">Performance Rating (1 - 5)</label>
                  <select
                    className="form-control-custom"
                    value={perfForm.performanceScore}
                    onChange={(e) =>
                      setPerfForm({ ...perfForm, performanceScore: Number(e.target.value) })
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
                    value={perfForm.lastReviewDate}
                    onChange={(e) =>
                      setPerfForm({ ...perfForm, lastReviewDate: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label-custom">Manager Feedback</label>
                  <textarea
                    rows={4}
                    className="form-control-custom"
                    placeholder="Provide constructive feedback, key accomplishments, and areas for improvement..."
                    value={perfForm.managerFeedback}
                    onChange={(e) =>
                      setPerfForm({ ...perfForm, managerFeedback: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-outline-custom"
                  onClick={() => setShowPerfModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary-custom">
                  Save Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
