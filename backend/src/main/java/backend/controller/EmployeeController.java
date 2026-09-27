package backend.controller;

import backend.model.ActivityLog;
import backend.model.Employee;
import backend.model.Notification;
import backend.repository.ActivityLogRepository;
import backend.repository.EmployeeRepository;
import backend.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {

    @Autowired
    private EmployeeRepository repo;

    @Autowired
    private ActivityLogRepository activityRepo;

    @Autowired
    private NotificationRepository notificationRepo;

    // Preserve existing endpoint: /employees/register
    @PostMapping("/register")
    public Employee addEmployee(@RequestBody Employee employee) {
        return saveEmployeeInternal(employee);
    }

    // Also support direct POST /employees
    @PostMapping
    public Employee createEmployee(@RequestBody Employee employee) {
        return saveEmployeeInternal(employee);
    }

    private Employee saveEmployeeInternal(Employee employee) {
        if (employee.getStatus() == null || employee.getStatus().isEmpty()) {
            employee.setStatus("Active");
        }
        if (employee.getPerformanceScore() == null) {
            employee.setPerformanceScore(3);
        }
        if (employee.getAvatarUrl() == null || employee.getAvatarUrl().isEmpty()) {
            String nameSeed = employee.getName() != null ? employee.getName().replace(" ", "") : "User";
            employee.setAvatarUrl("https://api.dicebear.com/7.x/avataaars/svg?seed=" + nameSeed);
        }

        Employee saved = repo.save(employee);

        // Record activity
        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
        activityRepo.save(new ActivityLog(null, "Employee Added",
                "New employee added: " + saved.getName() + " (" + (saved.getDepartment() != null ? saved.getDepartment() : "General") + ")",
                "HR Admin", now, "Employee"));

        // Push notification
        notificationRepo.save(new Notification(null, "New Employee Added",
                saved.getName() + " has joined the " + (saved.getDepartment() != null ? saved.getDepartment() : "team") + " department.",
                "info", "Just now", false, "/employees"));

        return saved;
    }

    @GetMapping
    public List<Employee> getAllEmployees() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public Employee getEmployeeById(@PathVariable Long id) {
        return repo.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Employee updateEmployee(@PathVariable Long id, @RequestBody Employee updatedEmployee) {
        Employee employee = repo.findById(id).orElse(null);

        if (employee != null) {
            employee.setName(updatedEmployee.getName());
            employee.setEmail(updatedEmployee.getEmail());
            employee.setDepartment(updatedEmployee.getDepartment());

            if (updatedEmployee.getPhone() != null) employee.setPhone(updatedEmployee.getPhone());
            if (updatedEmployee.getDesignation() != null) employee.setDesignation(updatedEmployee.getDesignation());
            if (updatedEmployee.getLocation() != null) employee.setLocation(updatedEmployee.getLocation());
            if (updatedEmployee.getDateOfJoining() != null) employee.setDateOfJoining(updatedEmployee.getDateOfJoining());
            if (updatedEmployee.getSalary() != null) employee.setSalary(updatedEmployee.getSalary());
            if (updatedEmployee.getStatus() != null) employee.setStatus(updatedEmployee.getStatus());
            if (updatedEmployee.getPerformanceScore() != null) {
                employee.setPerformanceScore(updatedEmployee.getPerformanceScore());
            }
            if (updatedEmployee.getPerformanceLevel() != null) {
                employee.setPerformanceLevel(updatedEmployee.getPerformanceLevel());
            }
            if (updatedEmployee.getManagerFeedback() != null) employee.setManagerFeedback(updatedEmployee.getManagerFeedback());
            if (updatedEmployee.getLastReviewDate() != null) employee.setLastReviewDate(updatedEmployee.getLastReviewDate());
            if (updatedEmployee.getReportingManager() != null) employee.setReportingManager(updatedEmployee.getReportingManager());
            if (updatedEmployee.getAvatarUrl() != null) employee.setAvatarUrl(updatedEmployee.getAvatarUrl());

            Employee saved = repo.save(employee);

            String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
            activityRepo.save(new ActivityLog(null, "Employee Updated",
                    "Updated profile details for " + saved.getName(),
                    "HR Admin", now, "Employee"));

            return saved;
        }

        return null;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable Long id) {
        Employee employee = repo.findById(id).orElse(null);
        if (employee != null) {
            String name = employee.getName();
            repo.deleteById(id);

            String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
            activityRepo.save(new ActivityLog(null, "Employee Deleted",
                    "Removed employee: " + name + " (ID: #" + id + ")",
                    "HR Admin", now, "Employee"));

            return ResponseEntity.ok(Map.of("message", "Employee deleted successfully"));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        List<Employee> all = repo.findAll();

        long total = all.size();
        long active = all.stream().filter(e -> "Active".equalsIgnoreCase(e.getStatus())).count();
        long onLeave = all.stream().filter(e -> "On Leave".equalsIgnoreCase(e.getStatus())).count();
        long inactive = all.stream().filter(e -> "Inactive".equalsIgnoreCase(e.getStatus())).count();

        // Department breakdown
        Map<String, Long> departmentCounts = all.stream()
                .filter(e -> e.getDepartment() != null && !e.getDepartment().trim().isEmpty())
                .collect(Collectors.groupingBy(Employee::getDepartment, Collectors.counting()));

        // Status breakdown
        Map<String, Long> statusCounts = new LinkedHashMap<>();
        statusCounts.put("Active", active);
        statusCounts.put("On Leave", onLeave);
        statusCounts.put("Inactive", inactive);

        // Performance breakdown (1 to 5)
        Map<String, Long> performanceCounts = new LinkedHashMap<>();
        performanceCounts.put("Needs Improvement (1)", all.stream().filter(e -> e.getPerformanceScore() != null && e.getPerformanceScore() == 1).count());
        performanceCounts.put("Developing (2)", all.stream().filter(e -> e.getPerformanceScore() != null && e.getPerformanceScore() == 2).count());
        performanceCounts.put("Meets Expectations (3)", all.stream().filter(e -> e.getPerformanceScore() != null && e.getPerformanceScore() == 3).count());
        performanceCounts.put("Very Good (4)", all.stream().filter(e -> e.getPerformanceScore() != null && e.getPerformanceScore() == 4).count());
        performanceCounts.put("Excellent (5)", all.stream().filter(e -> e.getPerformanceScore() != null && e.getPerformanceScore() == 5).count());

        // Joining trends by year
        Map<String, Long> joiningTrends = all.stream()
                .filter(e -> e.getDateOfJoining() != null && e.getDateOfJoining().length() >= 4)
                .collect(Collectors.groupingBy(e -> e.getDateOfJoining().substring(0, 4), TreeMap::new, Collectors.counting()));

        // Average Salary
        double avgSalary = all.stream()
                .filter(e -> e.getSalary() != null)
                .mapToDouble(Employee::getSalary)
                .average()
                .orElse(0.0);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalEmployees", total);
        stats.put("activeEmployees", active);
        stats.put("onLeaveEmployees", onLeave);
        stats.put("inactiveEmployees", inactive);
        stats.put("departmentCounts", departmentCounts);
        stats.put("statusCounts", statusCounts);
        stats.put("performanceCounts", performanceCounts);
        stats.put("joiningTrends", joiningTrends);
        stats.put("averageSalary", Math.round(avgSalary));

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/employee-of-the-month")
    public ResponseEntity<?> getEmployeeOfTheMonth() {
        List<Employee> all = repo.findAll();

        if (all.isEmpty()) {
            return ResponseEntity.ok(Map.of("message", "No employee records found"));
        }

        // Rule: Highest performance score, then highest salary or lowest ID
        Employee topEmployee = all.stream()
                .filter(e -> "Active".equalsIgnoreCase(e.getStatus()))
                .max(Comparator.comparing((Employee e) -> e.getPerformanceScore() != null ? e.getPerformanceScore() : 0)
                        .thenComparing(e -> e.getSalary() != null ? e.getSalary() : 0.0))
                .orElse(all.get(0));

        Map<String, Object> response = new HashMap<>();
        response.put("employee", topEmployee);
        response.put("title", "Employee of the Month");
        response.put("achievementSummary", "Awarded for exceptional code quality, consistent project deliveries, and outstanding mentorship across engineering teams.");
        response.put("awardedDate", "September 2026");
        response.put("score", topEmployee.getPerformanceScore());

        return ResponseEntity.ok(response);
    }
}