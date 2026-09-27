# PulseHR — Enterprise Employee Management Portal

A full-stack, enterprise-grade HR Employee Management System built with **React.js 19**, **Spring Boot 4**, and **MySQL 8**. Designed with modern UI/UX principles, real-time analytics, and role-based workflows for workforce administration.

---

## 🌟 Key Features & Architectural Highlights

### 1. 📊 Executive HR Analytics Dashboard
* **Real-time KPI Metrics**: Total Employees, Active Workforce, Employees on Leave, Inactive Staff.
* **Interactive Chart.js Visualizations**:
  * Department Headcount Distribution (Doughnut Chart)
  * Employment Status Distribution (Pie Chart)
  * Annual Hiring & Retention Trend (Area Line Chart)
  * Performance Score Breakdown (Bar Chart)
* **Rule-based Employee of the Month**: Transparently calculates top performer based on annual rating and achievements.
* **Live Audit Log**: Chronological activity feed tracking employee additions, leave decisions, and reviews.
* **Quick Actions Panel**: Direct shortcuts to common administrative workflows.

### 2. 👥 Employee Management & Directory
* **Comprehensive Data Attributes**: Employee ID, Profile Avatar, Full Name, Email, Phone, Department, Designation, Location, Date of Joining, Monthly Salary, Employment Status, Performance Rating.
* **Multi-Filter & Search Combinations**:
  * Live instant search across names, emails, roles, and locations
  * Multi-dimensional filtering: Department + Status + Role + Joining Year
  * Dynamic multi-column sorting (by ID, Name, Department, Date of Joining, Salary, Rating)
  * Client-side pagination with selectable page sizes (5, 10, 20)
* **CSV Export**: One-click export of filtered employee directories with RFC-compliant CSV formatting.
* **Confirmation Dialogs**: Custom modal confirmation before critical deletion actions.

### 3. 🎯 Unique Feature: Technical Skill Matrix
* **5-Level Proficiency Scale**: Beginner (1/5), Basic (2/5), Intermediate (3/5), Advanced (4/5), Expert (5/5).
* Visual progress bars and level tags per employee.
* Add, evaluate, and remove technical and professional competencies backed by persistent MySQL database storage.

### 4. 📈 Performance Management & OKR Tracker
* **Standardized 1–5 Rating Scale**: Needs Improvement, Developing, Meets Expectations, Very Good, Excellent.
* Visual star ratings, manager feedback notes, and review date history.
* **Employee Goal Tracker**: Track quarterly OKRs with title, description, start/target dates, status badges (Not Started, In Progress, Completed), and visual progress meters.

### 5. ⏳ Unique Feature: Career Growth Timeline
* Vertical milestone timeline on employee profiles documenting organizational progression, role promotions, and scope of responsibilities over time.

### 6. 🏖️ Leave Management & Approval Workflows
* **Leave Categories**: Casual Leave, Sick Leave, Personal Leave.
* **Approval Pipeline**: Pending, Approved, Rejected statuses with reviewer feedback comments.
* **Automated Status Sync**: When leaves are approved, employee status automatically synchronizes to "On Leave".

### 7. 🌗 Dual-Theme System (Light & Dark Mode)
* Complete dark theme support with custom CSS variables.
* Instant toggle with persistence in `localStorage`.
* High-contrast accessibility across tables, cards, forms, and charts.

### 8. 🔔 Notification System & Activity Audit Trail
* Top navigation dropdown with live unread badge counters.
* Automated notification generation for leave requests, new hires, and milestone anniversaries.
* "Mark All Read" action and persistent audit logging.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, React Router v7, Chart.js, React-Chartjs-2, React Icons, Bootstrap 5 |
| **Backend** | Java 17, Spring Boot 4.0.6, Spring Data JPA, Hibernate ORM, Maven |
| **Database** | MySQL 8.0 with InnoDB transactional engine (`employee_db`) |
| **Architecture** | RESTful Microservices-ready API, Context API State Management |

---

## 📂 Project Architecture

```
Employee-Portal/
├── backend/
│   ├── src/main/java/backend/
│   │   ├── config/
│   │   │   └── DataInitializer.java        # Database seeder & backfill logic
│   │   ├── controller/
│   │   │   ├── EmployeeController.java     # CRUD, Stats & Employee of Month
│   │   │   ├── SkillController.java        # Skill Matrix endpoints
│   │   │   ├── GoalController.java         # OKR & Goal Tracker endpoints
│   │   │   ├── CareerHistoryController.java# Career Timeline endpoints
│   │   │   ├── LeaveController.java        # Leave approval workflows
│   │   │   ├── ActivityController.java     # Audit logging endpoints
│   │   │   ├── NotificationController.java # Alert & notifications
│   │   │   └── UserController.java         # Authentication & user directory
│   │   ├── model/
│   │   │   ├── Employee.java
│   │   │   ├── Skill.java
│   │   │   ├── Goal.java
│   │   │   ├── CareerHistory.java
│   │   │   ├── LeaveRequest.java
│   │   │   ├── ActivityLog.java
│   │   │   ├── Notification.java
│   │   │   └── User.java
│   │   └── repository/                     # Spring Data JPA Repositories
│   ├── src/main/resources/
│   │   └── application.properties          # MySQL database connection
│   └── pom.xml
│
└── react-frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Common/                     # Avatar, Badge, StarRating, Modals, etc.
    │   │   └── Layout/                     # Sidebar, Navbar, Layout wrapper
    │   ├── context/
    │   │   ├── ThemeContext.jsx            # Light/Dark mode state
    │   │   ├── ToastContext.jsx            # Animated toast notification manager
    │   │   └── AuthContext.jsx             # User session provider
    │   ├── pages/
    │   │   ├── Dashboard.jsx               # Analytics & KPI cards
    │   │   ├── Employees.jsx               # Filterable employee directory
    │   │   ├── EmployeeProfile.jsx         # Profile, Skill Matrix & OKRs
    │   │   ├── AddEmployee.jsx             # Validated employee form
    │   │   ├── EditEmployee.jsx            # Profile editing form
    │   │   ├── LeaveManagement.jsx         # Leave approval portal
    │   │   ├── Performance.jsx             # Review ratings & score charts
    │   │   ├── Reports.jsx                 # Exportable executive reports
    │   │   ├── Profile.jsx                 # Admin user profile
    │   │   ├── Settings.jsx                # Theme and system preferences
    │   │   ├── Login.jsx                   # Modern sign-in page
    │   │   └── Register.jsx                # Account creation
    │   ├── services/
    │   │   └── api.js                      # Centralized API service layer
    │   ├── App.jsx                         # Router configuration
    │   └── index.css                       # Complete design system
    ├── package.json
    └── vite.config.js
```

---

## 📡 REST API Specifications

### Employee Endpoints
- `GET /employees` — List all employees
- `GET /employees/{id}` — Get employee details by ID
- `POST /employees` / `POST /employees/register` — Create new employee record
- `PUT /employees/{id}` — Update employee specifications
- `DELETE /employees/{id}` — Delete employee record
- `GET /employees/stats` — Consolidated dashboard analytics & headcount distributions
- `GET /employees/employee-of-the-month` — Top performer metrics and summary

### Skill Matrix Endpoints
- `GET /skills/employee/{employeeId}` — Get all skills for an employee
- `POST /skills` — Add new skill
- `PUT /skills/{id}` — Update skill level
- `DELETE /skills/{id}` — Delete skill

### Goal Tracker Endpoints
- `GET /goals` — Get all company goals
- `GET /goals/employee/{employeeId}` — Get goals for an employee
- `POST /goals` — Create professional goal
- `PUT /goals/{id}` — Update goal progress and status
- `DELETE /goals/{id}` — Delete goal

### Leave Management Endpoints
- `GET /leaves` — List all leave applications
- `POST /leaves` — Apply for leave
- `PUT /leaves/{id}/status` — Approve or reject leave request
- `DELETE /leaves/{id}` — Delete leave record

### Activity & Notification Endpoints
- `GET /activities` — Retrieve recent audit logs
- `GET /notifications` — List system notifications
- `PUT /notifications/{id}/read` — Mark notification as read
- `PUT /notifications/read-all` — Mark all notifications as read

### User Authentication Endpoints
- `POST /users/register` — Register administrator account
- `POST /users/login` — Authenticate user session

---

## 🚀 Getting Started

### Prerequisites
- **Java Development Kit (JDK 17+)**
- **Node.js (v18+)** and **npm**
- **MySQL Server (v8.0+)**

### Backend Setup
1. Verify MySQL database is running:
   ```sql
   CREATE DATABASE IF NOT EXISTS employee_db;
   ```
2. Navigate to `backend` directory:
   ```powershell
   cd backend
   .\mvnw.cmd spring-boot:run
   ```
   The backend starts at `http://localhost:8080`.

### Frontend Setup
1. Navigate to `react-frontend` directory:
   ```powershell
   cd react-frontend
   npm install
   npm run dev
   ```
2. Open your browser at `http://localhost:5173`.

---

## 👤 Author
**Amruthavarshini S**  
*Lead Full Stack Developer & Project Creator*
