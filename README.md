# PulseHR — Enterprise Employee Management Portal

A full-stack, enterprise-grade Employee Management System built with **React.js 19**, **Spring Boot 4**, and **MySQL 8**. PulseHR provides a centralized platform for employee management, HR analytics, performance tracking, skill management, leave workflows, career growth, notifications, and administrative operations.

---

## 🌟 Key Features

### 1. 📊 Executive HR Analytics Dashboard

- Real-time KPI metrics:
  - Total Employees
  - Active Employees
  - Employees on Leave
  - Inactive Employees
- Interactive Chart.js visualizations:
  - Department Headcount Distribution
  - Employment Status Distribution
  - Employee Joining Trends
  - Performance Score Breakdown
- Employee of the Month
- Live activity/audit log
- Quick administrative actions

### 2. 👥 Employee Management & Directory

- Add new employees
- View employee records
- Edit employee information
- Delete employee records
- Employee profile avatars
- Search employees
- Filter by:
  - Department
  - Status
  - Role/Designation
  - Joining Year
- Multi-column sorting
- Pagination
- CSV export
- Confirmation dialogs for critical actions

Employee information includes:

- Employee ID
- Name
- Email
- Phone
- Department
- Designation
- Location
- Date of Joining
- Salary
- Employment Status
- Performance Rating

### 3. 🎯 Technical Skill Matrix

- 5-level skill proficiency system:
  - Beginner
  - Basic
  - Intermediate
  - Advanced
  - Expert
- Visual skill progress indicators
- Add employee skills
- Update skill levels
- Remove skills
- Persistent MySQL storage

### 4. 📈 Performance Management & Goal Tracker

- Standardized 1–5 performance rating
- Performance categories:
  - Needs Improvement
  - Developing
  - Meets Expectations
  - Very Good
  - Excellent
- Star-based performance ratings
- Manager feedback
- Review dates
- Employee goal tracking
- Quarterly OKRs
- Goal progress tracking
- Goal status:
  - Not Started
  - In Progress
  - Completed

### 5. ⏳ Career Growth Timeline

- Employee career history
- Organizational milestones
- Role progression
- Promotions
- Responsibilities and career development timeline

### 6. 🏖️ Leave Management

- Apply for employee leave
- Leave categories:
  - Casual Leave
  - Sick Leave
  - Personal Leave
- Leave approval workflow
- Pending, Approved and Rejected statuses
- Reviewer feedback
- Employee status synchronization when leave is approved

### 7. 🌗 Light & Dark Mode

- Complete light and dark theme support
- Theme persistence using `localStorage`
- Responsive UI across:
  - Dashboard
  - Tables
  - Forms
  - Cards
  - Charts
  - Navigation

### 8. 🔔 Notifications & Activity Audit

- Notification dropdown
- Unread notification count
- Employee-related notifications
- Leave-related notifications
- New employee notifications
- Mark notification as read
- Mark all notifications as read
- Activity/audit history

### 9. 📊 Reports

- Employee statistics
- Department information
- Performance information
- Workforce analytics
- Exportable employee data

### 10. 🔐 Authentication

- User registration
- User login
- Authentication validation
- User profile management

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React.js 19, Vite, React Router, Chart.js, React-Chartjs-2, React Icons, Bootstrap |
| **Backend** | Java 17, Spring Boot 4, Spring Data JPA, Hibernate, Maven |
| **Database** | MySQL 8 |
| **Architecture** | RESTful APIs, Context API, Layered Architecture |
| **Development Tools** | VS Code, Git, GitHub, MySQL Workbench, Postman |

---

## 📂 Project Architecture

```text
Employee-Portal/
│
├── backend/
│   ├── src/main/java/backend/
│   │   ├── config/
│   │   │   └── DataInitializer.java
│   │   │
│   │   ├── controller/
│   │   │   ├── EmployeeController.java
│   │   │   ├── SkillController.java
│   │   │   ├── GoalController.java
│   │   │   ├── CareerHistoryController.java
│   │   │   ├── LeaveController.java
│   │   │   ├── ActivityController.java
│   │   │   ├── NotificationController.java
│   │   │   └── UserController.java
│   │   │
│   │   ├── model/
│   │   │   ├── Employee.java
│   │   │   ├── Skill.java
│   │   │   ├── Goal.java
│   │   │   ├── CareerHistory.java
│   │   │   ├── LeaveRequest.java
│   │   │   ├── ActivityLog.java
│   │   │   ├── Notification.java
│   │   │   └── User.java
│   │   │
│   │   └── repository/
│   │       ├── EmployeeRepository.java
│   │       ├── SkillRepository.java
│   │       ├── GoalRepository.java
│   │       ├── CareerHistoryRepository.java
│   │       ├── LeaveRequestRepository.java
│   │       ├── ActivityLogRepository.java
│   │       └── NotificationRepository.java
│   │
│   ├── src/main/resources/
│   │   └── application.properties
│   │
│   └── pom.xml
│
└── react-frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Common/
    │   │   └── Layout/
    │   │
    │   ├── context/
    │   │   ├── ThemeContext.jsx
    │   │   ├── ToastContext.jsx
    │   │   └── AuthContext.jsx
    │   │
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── Employees.jsx
    │   │   ├── EmployeeProfile.jsx
    │   │   ├── AddEmployee.jsx
    │   │   ├── EditEmployee.jsx
    │   │   ├── LeaveManagement.jsx
    │   │   ├── Performance.jsx
    │   │   ├── Reports.jsx
    │   │   ├── Profile.jsx
    │   │   ├── Settings.jsx
    │   │   ├── Login.jsx
    │   │   └── Register.jsx
    │   │
    │   ├── services/
    │   │   └── api.js
    │   │
    │   ├── App.jsx
    │   └── index.css
    │
    ├── package.json
    └── vite.config.js

## 🚀 How to Run

### Backend

Open a terminal and run the following commands:

cd E:\Projects\Employee-Portal\backend
.\mvnw.cmd spring-boot:run

The backend server will run on:

http://localhost:8080

### Frontend

Open a separate terminal and run the following commands:

cd E:\Projects\Employee-Portal\react-frontend
npm install
npm run dev

The frontend application will run on:

http://localhost:5173

### Application Flow

React.js Frontend
       ↓
Spring Boot Backend
       ↓
MySQL Database

---

## 👩‍💻 Author

**Amruthavarshini S**

Software Engineer | Java Full Stack Developer
