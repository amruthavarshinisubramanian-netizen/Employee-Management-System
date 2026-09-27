package backend.controller;

import backend.model.ActivityLog;
import backend.model.Goal;
import backend.repository.ActivityLogRepository;
import backend.repository.GoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/goals")
@CrossOrigin(origins = "*")
public class GoalController {

    @Autowired
    private GoalRepository goalRepo;

    @Autowired
    private ActivityLogRepository activityRepo;

    @GetMapping
    public List<Goal> getAllGoals() {
        return goalRepo.findAll();
    }

    @GetMapping("/employee/{employeeId}")
    public List<Goal> getGoalsByEmployee(@PathVariable Long employeeId) {
        return goalRepo.findByEmployeeId(employeeId);
    }

    @PostMapping
    public Goal addGoal(@RequestBody Goal goal) {
        Goal saved = goalRepo.save(goal);
        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
        activityRepo.save(new ActivityLog(null, "Goal Created",
                "Created goal '" + saved.getTitle() + "' for Employee #" + saved.getEmployeeId(),
                "HR Admin", now, "Goal"));
        return saved;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Goal> updateGoal(@PathVariable Long id, @RequestBody Goal updatedGoal) {
        return goalRepo.findById(id).map(goal -> {
            goal.setTitle(updatedGoal.getTitle());
            goal.setDescription(updatedGoal.getDescription());
            goal.setStartDate(updatedGoal.getStartDate());
            goal.setTargetDate(updatedGoal.getTargetDate());
            goal.setProgress(updatedGoal.getProgress());
            if (updatedGoal.getStatus() != null) {
                goal.setStatus(updatedGoal.getStatus());
            }
            Goal saved = goalRepo.save(goal);

            String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
            activityRepo.save(new ActivityLog(null, "Goal Updated",
                    "Updated goal '" + saved.getTitle() + "' (" + saved.getProgress() + "% - " + saved.getStatus() + ")",
                    "HR Admin", now, "Goal"));

            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGoal(@PathVariable Long id) {
        if (goalRepo.existsById(id)) {
            goalRepo.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Goal deleted successfully"));
        }
        return ResponseEntity.notFound().build();
    }
}
