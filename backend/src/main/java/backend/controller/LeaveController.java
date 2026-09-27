package backend.controller;

import backend.model.ActivityLog;
import backend.model.Employee;
import backend.model.LeaveRequest;
import backend.model.Notification;
import backend.repository.ActivityLogRepository;
import backend.repository.EmployeeRepository;
import backend.repository.LeaveRequestRepository;
import backend.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/leaves")
@CrossOrigin(origins = "*")
public class LeaveController {

    @Autowired
    private LeaveRequestRepository leaveRepo;

    @Autowired
    private EmployeeRepository employeeRepo;

    @Autowired
    private ActivityLogRepository activityRepo;

    @Autowired
    private NotificationRepository notificationRepo;

    @GetMapping
    public List<LeaveRequest> getAllLeaves() {
        return leaveRepo.findAllByOrderByAppliedDateDesc();
    }

    @GetMapping("/employee/{employeeId}")
    public List<LeaveRequest> getLeavesByEmployee(@PathVariable Long employeeId) {
        return leaveRepo.findByEmployeeId(employeeId);
    }

    @PostMapping
    public LeaveRequest applyLeave(@RequestBody LeaveRequest request) {
        if (request.getAppliedDate() == null || request.getAppliedDate().isEmpty()) {
            request.setAppliedDate(LocalDate.now().toString());
        }
        if (request.getStatus() == null || request.getStatus().isEmpty()) {
            request.setStatus("Pending");
        }

        // Fill employee name & department if not supplied
        if (request.getEmployeeId() != null) {
            employeeRepo.findById(request.getEmployeeId()).ifPresent(emp -> {
                if (request.getEmployeeName() == null || request.getEmployeeName().isEmpty()) {
                    request.setEmployeeName(emp.getName());
                }
                if (request.getDepartment() == null || request.getDepartment().isEmpty()) {
                    request.setDepartment(emp.getDepartment());
                }
            });
        }

        LeaveRequest saved = leaveRepo.save(request);

        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
        activityRepo.save(new ActivityLog(null, "Leave Requested",
                saved.getEmployeeName() + " applied for " + saved.getLeaveType() + " (" + saved.getStartDate() + " to " + saved.getEndDate() + ")",
                saved.getEmployeeName() != null ? saved.getEmployeeName() : "Employee", now, "Leave"));

        notificationRepo.save(new Notification(null, "New Leave Request Submitted",
                saved.getEmployeeName() + " requested " + saved.getLeaveType() + " from " + saved.getStartDate() + " to " + saved.getEndDate(),
                "leave", "Just now", false, "/leaves"));

        return saved;
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<LeaveRequest> updateLeaveStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String newStatus = payload.get("status");
        String reviewComments = payload.get("reviewComments");

        return leaveRepo.findById(id).map(leave -> {
            leave.setStatus(newStatus);
            if (reviewComments != null) {
                leave.setReviewComments(reviewComments);
            }
            LeaveRequest saved = leaveRepo.save(leave);

            // If approved, update employee's status to "On Leave"
            if ("Approved".equalsIgnoreCase(newStatus) && leave.getEmployeeId() != null) {
                employeeRepo.findById(leave.getEmployeeId()).ifPresent(emp -> {
                    emp.setStatus("On Leave");
                    employeeRepo.save(emp);
                });
            } else if ("Rejected".equalsIgnoreCase(newStatus) && leave.getEmployeeId() != null) {
                employeeRepo.findById(leave.getEmployeeId()).ifPresent(emp -> {
                    if ("On Leave".equalsIgnoreCase(emp.getStatus())) {
                        emp.setStatus("Active");
                        employeeRepo.save(emp);
                    }
                });
            }

            String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
            activityRepo.save(new ActivityLog(null, "Leave " + newStatus,
                    "Leave request #" + leave.getId() + " for " + leave.getEmployeeName() + " was " + newStatus,
                    "HR Admin", now, "Leave"));

            notificationRepo.save(new Notification(null, "Leave Request " + newStatus,
                    "Leave request for " + leave.getEmployeeName() + " (" + leave.getLeaveType() + ") has been " + newStatus.toLowerCase() + ".",
                    "Approved".equalsIgnoreCase(newStatus) ? "success" : "warning", "Just now", false, "/leaves"));

            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLeave(@PathVariable Long id) {
        if (leaveRepo.existsById(id)) {
            leaveRepo.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Leave request deleted successfully"));
        }
        return ResponseEntity.notFound().build();
    }
}
