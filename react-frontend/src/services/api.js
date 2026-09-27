const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = "An unexpected error occurred.";
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorText;
    } catch {
      errorMessage = errorText || `HTTP Error ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
};

export const api = {
  // Employees
  getEmployees: () => fetch(`${API_BASE_URL}/employees`).then(handleResponse),
  getEmployeeById: (id) => fetch(`${API_BASE_URL}/employees/${id}`).then(handleResponse),
  addEmployee: (employee) =>
    fetch(`${API_BASE_URL}/employees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employee),
    }).then(handleResponse),
  updateEmployee: (id, employee) =>
    fetch(`${API_BASE_URL}/employees/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employee),
    }).then(handleResponse),
  deleteEmployee: (id) =>
    fetch(`${API_BASE_URL}/employees/${id}`, {
      method: "DELETE",
    }).then(handleResponse),
  getDashboardStats: () => fetch(`${API_BASE_URL}/employees/stats`).then(handleResponse),
  getEmployeeOfTheMonth: () => fetch(`${API_BASE_URL}/employees/employee-of-the-month`).then(handleResponse),

  // Skills
  getSkillsByEmployee: (empId) => fetch(`${API_BASE_URL}/skills/employee/${empId}`).then(handleResponse),
  addSkill: (skill) =>
    fetch(`${API_BASE_URL}/skills`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(skill),
    }).then(handleResponse),
  updateSkill: (id, skill) =>
    fetch(`${API_BASE_URL}/skills/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(skill),
    }).then(handleResponse),
  deleteSkill: (id) =>
    fetch(`${API_BASE_URL}/skills/${id}`, {
      method: "DELETE",
    }).then(handleResponse),

  // Goals
  getAllGoals: () => fetch(`${API_BASE_URL}/goals`).then(handleResponse),
  getGoalsByEmployee: (empId) => fetch(`${API_BASE_URL}/goals/employee/${empId}`).then(handleResponse),
  addGoal: (goal) =>
    fetch(`${API_BASE_URL}/goals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(goal),
    }).then(handleResponse),
  updateGoal: (id, goal) =>
    fetch(`${API_BASE_URL}/goals/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(goal),
    }).then(handleResponse),
  deleteGoal: (id) =>
    fetch(`${API_BASE_URL}/goals/${id}`, {
      method: "DELETE",
    }).then(handleResponse),

  // Career History
  getCareerByEmployee: (empId) => fetch(`${API_BASE_URL}/career/employee/${empId}`).then(handleResponse),
  addCareerEntry: (entry) =>
    fetch(`${API_BASE_URL}/career`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    }).then(handleResponse),
  deleteCareerEntry: (id) =>
    fetch(`${API_BASE_URL}/career/${id}`, {
      method: "DELETE",
    }).then(handleResponse),

  // Leave Requests
  getLeaves: () => fetch(`${API_BASE_URL}/leaves`).then(handleResponse),
  getLeavesByEmployee: (empId) => fetch(`${API_BASE_URL}/leaves/employee/${empId}`).then(handleResponse),
  applyLeave: (leave) =>
    fetch(`${API_BASE_URL}/leaves`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(leave),
    }).then(handleResponse),
  updateLeaveStatus: (id, status, reviewComments) =>
    fetch(`${API_BASE_URL}/leaves/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, reviewComments }),
    }).then(handleResponse),
  deleteLeave: (id) =>
    fetch(`${API_BASE_URL}/leaves/${id}`, {
      method: "DELETE",
    }).then(handleResponse),

  // Activities
  getRecentActivities: () => fetch(`${API_BASE_URL}/activities`).then(handleResponse),
  logActivity: (activity) =>
    fetch(`${API_BASE_URL}/activities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(activity),
    }).then(handleResponse),

  // Notifications
  getNotifications: () => fetch(`${API_BASE_URL}/notifications`).then(handleResponse),
  markNotificationRead: (id) =>
    fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: "PUT",
    }).then(handleResponse),
  markAllNotificationsRead: () =>
    fetch(`${API_BASE_URL}/notifications/read-all`, {
      method: "PUT",
    }).then(handleResponse),

  // Users & Auth
  login: (credentials) =>
    fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    }).then(handleResponse),
  register: (user) =>
    fetch(`${API_BASE_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    }).then(handleResponse),
  getUserByEmail: (email) =>
    fetch(`${API_BASE_URL}/users/by-email?email=${encodeURIComponent(email)}`).then(handleResponse),
};

export default api;
