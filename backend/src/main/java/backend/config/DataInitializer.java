package backend.config;

import backend.model.*;
import backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private CareerHistoryRepository careerHistoryRepository;

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private ActivityLogRepository activityLogRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
        seedEmployees();
        seedSkills();
        seedGoals();
        seedCareerHistory();
        seedLeaves();
        seedActivities();
        seedNotifications();
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setName("Admin HR");
            admin.setEmail("admin@hrportal.com");
            admin.setPassword("admin123");
            userRepository.save(admin);
        }
    }

    private void seedEmployees() {
        List<Employee> employees = employeeRepository.findAll();

        if (employees.isEmpty()) {
            // Seed base employees if table is completely empty
            createEmployee("Amruthavarshini S", "amruthavarshinisubramanian@gmail.com", "Engineering",
                    "+91 98401 23456", "Lead Full Stack Developer", "Chennai", "2023-01-15", 95000.0,
                    "Active", 5, "Outstanding technical leadership and flawless project deliveries.", "2026-08-20",
                    "Kavitha Raman (VP Engineering)");

            createEmployee("Tharunadhit", "tharun@gmail.com", "Quality Assurance",
                    "+91 98402 34567", "Senior QA Automation Lead", "Bangalore", "2023-04-10", 78000.0,
                    "Active", 4, "Strong test automation coverage and regression test improvements.", "2026-07-15",
                    "Amruthavarshini S");

            createEmployee("Parkavi", "parkavi@gmail.com", "Quality Assurance",
                    "+91 98403 45678", "QA Test Specialist", "Chennai", "2023-08-01", 62000.0,
                    "On Leave", 3, "Consistent attention to edge cases and bug verification.", "2026-06-10",
                    "Tharunadhit");

            createEmployee("Srimithra", "srimithra@gmail.com", "Engineering",
                    "+91 98404 56789", "Senior Frontend Engineer", "Hyderabad", "2023-11-20", 75000.0,
                    "Active", 4, "Exceptional React UI components and responsive design work.", "2026-08-10",
                    "Amruthavarshini S");

            createEmployee("Nandhini", "nandhini@gmail.com", "Quality Assurance",
                    "+91 98405 67890", "Performance Test Engineer", "Chennai", "2024-02-15", 68000.0,
                    "Active", 5, "Instrumental in load testing and sub-second API response tuning.", "2026-08-25",
                    "Tharunadhit");

            createEmployee("Aishwarya", "aishwarya@gmail.com", "Engineering",
                    "+91 98406 78901", "Backend Java Engineer", "Coimbatore", "2024-05-01", 65000.0,
                    "Active", 4, "Reliable microservices and clean Spring Boot API implementations.", "2026-07-30",
                    "Amruthavarshini S");

            createEmployee("Kayal", "kayal@gmail.com", "Product & Design",
                    "+91 98407 89012", "UI/UX Product Designer", "Chennai", "2024-09-10", 72000.0,
                    "Inactive", 2, "Transitioning roles; working on design system component consistency.", "2026-05-12",
                    "Kavitha Raman (VP Engineering)");

            createEmployee("Suvi", "suvi@gmail.com", "Engineering",
                    "+91 98408 90123", "Full Stack Developer", "Bangalore", "2025-01-20", 60000.0,
                    "Active", 4, "Great progress in building reusable components and API integrations.", "2026-08-05",
                    "Amruthavarshini S");
        } else {
            // Update existing employees if fields like designation/salary/phone are null
            for (Employee emp : employees) {
                boolean updated = false;

                if (emp.getPhone() == null || emp.getPhone().isEmpty()) {
                    emp.setPhone("+91 9840" + (10000 + (emp.getId() != null ? emp.getId() * 37 : 1234)));
                    updated = true;
                }

                if (emp.getLocation() == null || emp.getLocation().isEmpty()) {
                    emp.setLocation(emp.getId() % 2 == 0 ? "Chennai" : "Bangalore");
                    updated = true;
                }

                if (emp.getDateOfJoining() == null || emp.getDateOfJoining().isEmpty()) {
                    int year = 2023 + (int) ((emp.getId() != null ? emp.getId() : 1) % 3);
                    emp.setDateOfJoining(year + "-03-15");
                    updated = true;
                }

                if (emp.getSalary() == null || emp.getSalary() <= 0) {
                    emp.setSalary(65000.0 + ((emp.getId() != null ? emp.getId() : 1) * 3500.0));
                    updated = true;
                }

                if (emp.getStatus() == null || emp.getStatus().isEmpty()) {
                    if (emp.getId() == 8) {
                        emp.setStatus("On Leave");
                    } else if (emp.getId() == 12) {
                        emp.setStatus("Inactive");
                    } else {
                        emp.setStatus("Active");
                    }
                    updated = true;
                }

                if (emp.getDesignation() == null || emp.getDesignation().isEmpty()) {
                    String dept = emp.getDepartment() != null ? emp.getDepartment() : "Developer";
                    if (dept.equalsIgnoreCase("Developer") || dept.equalsIgnoreCase("Engineering")) {
                        emp.setDepartment("Engineering");
                        if (emp.getName() != null && emp.getName().toLowerCase().contains("amrutha")) {
                            emp.setDesignation("Lead Full Stack Developer");
                        } else {
                            emp.setDesignation("Software Engineer");
                        }
                    } else if (dept.equalsIgnoreCase("Testing") || dept.equalsIgnoreCase("Quality Assurance")) {
                        emp.setDepartment("Quality Assurance");
                        emp.setDesignation("QA Test Engineer");
                    } else {
                        emp.setDesignation("Technical Specialist");
                    }
                    updated = true;
                }

                if (emp.getPerformanceScore() == null) {
                    if (emp.getName() != null && emp.getName().toLowerCase().contains("amrutha")) {
                        emp.setPerformanceScore(5);
                    } else if (emp.getId() == 10) {
                        emp.setPerformanceScore(5);
                    } else if (emp.getId() == 12) {
                        emp.setPerformanceScore(2);
                    } else {
                        emp.setPerformanceScore(4);
                    }
                    updated = true;
                }

                if (emp.getManagerFeedback() == null) {
                    emp.setManagerFeedback("Demonstrates strong ownership, technical excellence, and dedication to team goals.");
                    emp.setLastReviewDate("2026-08-15");
                    emp.setReportingManager("Kavitha Raman (Director of Engineering)");
                    updated = true;
                }

                if (emp.getAvatarUrl() == null) {
                    emp.setAvatarUrl("https://api.dicebear.com/7.x/avataaars/svg?seed=" + emp.getName().replace(" ", ""));
                    updated = true;
                }

                if (updated) {
                    employeeRepository.save(emp);
                }
            }
        }
    }

    private void createEmployee(String name, String email, String dept, String phone,
                                String designation, String loc, String doj, Double salary,
                                String status, Integer score, String feedback, String reviewDate,
                                String manager) {
        Employee e = new Employee();
        e.setName(name);
        e.setEmail(email);
        e.setDepartment(dept);
        e.setPhone(phone);
        e.setDesignation(designation);
        e.setLocation(loc);
        e.setDateOfJoining(doj);
        e.setSalary(salary);
        e.setStatus(status);
        e.setPerformanceScore(score);
        e.setManagerFeedback(feedback);
        e.setLastReviewDate(reviewDate);
        e.setReportingManager(manager);
        e.setAvatarUrl("https://api.dicebear.com/7.x/avataaars/svg?seed=" + name.replace(" ", ""));
        employeeRepository.save(e);
    }

    private void seedSkills() {
        if (skillRepository.count() == 0) {
            List<Employee> employees = employeeRepository.findAll();
            for (Employee emp : employees) {
                Long empId = emp.getId();
                String dept = emp.getDepartment() != null ? emp.getDepartment() : "";

                if (dept.equalsIgnoreCase("Engineering") || dept.equalsIgnoreCase("Developer")) {
                    skillRepository.save(new Skill(null, empId, "Java", 5));
                    skillRepository.save(new Skill(null, empId, "Spring Boot", 5));
                    skillRepository.save(new Skill(null, empId, "React", 4));
                    skillRepository.save(new Skill(null, empId, "JavaScript", 4));
                    skillRepository.save(new Skill(null, empId, "SQL / MySQL", 4));
                    skillRepository.save(new Skill(null, empId, "REST APIs", 5));
                } else if (dept.equalsIgnoreCase("Quality Assurance") || dept.equalsIgnoreCase("Testing")) {
                    skillRepository.save(new Skill(null, empId, "Selenium WebDriver", 5));
                    skillRepository.save(new Skill(null, empId, "Java", 4));
                    skillRepository.save(new Skill(null, empId, "API Testing (Postman)", 5));
                    skillRepository.save(new Skill(null, empId, "TestNG / JUnit", 4));
                    skillRepository.save(new Skill(null, empId, "SQL", 3));
                } else {
                    skillRepository.save(new Skill(null, empId, "UI/UX Design", 5));
                    skillRepository.save(new Skill(null, empId, "Figma", 5));
                    skillRepository.save(new Skill(null, empId, "HTML & CSS", 4));
                    skillRepository.save(new Skill(null, empId, "User Research", 4));
                }
            }
        }
    }

    private void seedGoals() {
        if (goalRepository.count() == 0) {
            List<Employee> employees = employeeRepository.findAll();
            for (Employee emp : employees) {
                Long empId = emp.getId();
                goalRepository.save(new Goal(null, empId, "Complete Spring Boot & Microservices Upgrade",
                        "Migrate microservices and optimize Hibernate JPA queries for high throughput.",
                        "2026-07-01", "2026-10-31", 75, "In Progress"));

                goalRepository.save(new Goal(null, empId, "Achieve Cloud Architecture Certification",
                        "Complete study modules and practice exams for AWS Certified Solutions Architect.",
                        "2026-08-01", "2026-11-15", 50, "In Progress"));

                goalRepository.save(new Goal(null, empId, "Refactor Core Authentication Flow",
                        "Implement JWT tokens, role-based checks, and clean error handling.",
                        "2026-05-01", "2026-08-01", 100, "Completed"));
            }
        }
    }

    private void seedCareerHistory() {
        if (careerHistoryRepository.count() == 0) {
            List<Employee> employees = employeeRepository.findAll();
            for (Employee emp : employees) {
                Long empId = emp.getId();
                String dept = emp.getDepartment() != null ? emp.getDepartment() : "Engineering";

                careerHistoryRepository.save(new CareerHistory(null, empId, "2023",
                        "Associate Software Engineer", dept,
                        "Joined as graduate engineer; developed core data structures and automated unit tests."));

                careerHistoryRepository.save(new CareerHistory(null, empId, "2024",
                        "Software Engineer", dept,
                        "Promoted to Software Engineer; built reusable React components and Spring Boot REST APIs."));

                careerHistoryRepository.save(new CareerHistory(null, empId, "2025",
                        "Senior Software Engineer", dept,
                        "Promoted to Senior Engineer; optimized database performance and mentored junior colleagues."));

                careerHistoryRepository.save(new CareerHistory(null, empId, "2026",
                        emp.getDesignation() != null ? emp.getDesignation() : "Lead Engineer", dept,
                        "Currently driving HR portal innovations and architecture scalability."));
            }
        }
    }

    private void seedLeaves() {
        if (leaveRequestRepository.count() == 0) {
            List<Employee> employees = employeeRepository.findAll();
            if (!employees.isEmpty()) {
                Employee e1 = employees.get(0);
                Employee e2 = employees.size() > 1 ? employees.get(1) : e1;
                Employee e3 = employees.size() > 2 ? employees.get(2) : e1;

                leaveRequestRepository.save(new LeaveRequest(null, e2.getId(), e2.getName(), e2.getDepartment(),
                        "Casual Leave", "2026-10-02", "2026-10-04",
                        "Family gathering in hometown", "Pending", "2026-09-27", null));

                leaveRequestRepository.save(new LeaveRequest(null, e3.getId(), e3.getName(), e3.getDepartment(),
                        "Sick Leave", "2026-09-25", "2026-09-29",
                        "Recovering from viral fever, doctor advised rest", "Approved", "2026-09-24", "Approved by HR. Get well soon!"));

                leaveRequestRepository.save(new LeaveRequest(null, e1.getId(), e1.getName(), e1.getDepartment(),
                        "Personal Leave", "2026-10-15", "2026-10-16",
                        "Attending tech summit as speaker", "Pending", "2026-09-26", null));
            }
        }
    }

    private void seedActivities() {
        if (activityLogRepository.count() == 0) {
            activityLogRepository.save(new ActivityLog(null, "Employee Added",
                    "New employee registered: Amruthavarshini S in Engineering",
                    "HR Admin", "2026-09-25 09:30", "Employee"));

            activityLogRepository.save(new ActivityLog(null, "Leave Approved",
                    "Approved 5 days Sick Leave for Parkavi",
                    "HR Admin", "2026-09-25 11:20", "Leave"));

            activityLogRepository.save(new ActivityLog(null, "Performance Review",
                    "Completed annual review: Amruthavarshini S rated 5/5 (Excellent)",
                    "Kavitha Raman", "2026-09-26 14:00", "Performance"));

            activityLogRepository.save(new ActivityLog(null, "Goal Milestone",
                    "Goal 'Refactor Core Authentication Flow' marked 100% Completed",
                    "System", "2026-09-26 17:45", "Goal"));

            activityLogRepository.save(new ActivityLog(null, "Leave Request",
                    "Tharunadhit requested 3 days Casual Leave",
                    "Tharunadhit", "2026-09-27 10:15", "Leave"));
        }
    }

    private void seedNotifications() {
        if (notificationRepository.count() == 0) {
            notificationRepository.save(new Notification(null, "New Leave Request Pending",
                    "Tharunadhit requested 3 days Casual Leave starting Oct 02.",
                    "leave", "10m ago", false, "/leaves"));

            notificationRepository.save(new Notification(null, "Employee of the Month Announced",
                    "Amruthavarshini S has been awarded Employee of the Month for Outstanding Performance!",
                    "success", "1h ago", false, "/dashboard"));

            notificationRepository.save(new Notification(null, "Goal Target Approaching",
                    "Sprint Goal 'Complete Spring Boot Upgrade' is due in 30 days (75% completed).",
                    "goal", "3h ago", false, "/performance"));

            notificationRepository.save(new Notification(null, "Work Anniversary",
                    "Celebrating 3 years with the organization for Tharunadhit today! 🎉",
                    "anniversary", "5h ago", true, "/employees"));
        }
    }
}
