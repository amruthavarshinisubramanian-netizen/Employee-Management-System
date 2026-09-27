package backend.controller;

import backend.model.ActivityLog;
import backend.model.CareerHistory;
import backend.repository.ActivityLogRepository;
import backend.repository.CareerHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/career")
@CrossOrigin(origins = "*")
public class CareerHistoryController {

    @Autowired
    private CareerHistoryRepository careerRepo;

    @Autowired
    private ActivityLogRepository activityRepo;

    @GetMapping("/employee/{employeeId}")
    public List<CareerHistory> getCareerHistory(@PathVariable Long employeeId) {
        return careerRepo.findByEmployeeIdOrderByYearAsc(employeeId);
    }

    @PostMapping
    public CareerHistory addCareerEntry(@RequestBody CareerHistory entry) {
        CareerHistory saved = careerRepo.save(entry);
        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
        activityRepo.save(new ActivityLog(null, "Career Milestone Added",
                "Added career milestone for Employee #" + saved.getEmployeeId() + ": " + saved.getDesignation() + " (" + saved.getYear() + ")",
                "HR Admin", now, "Career"));
        return saved;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCareerEntry(@PathVariable Long id) {
        if (careerRepo.existsById(id)) {
            careerRepo.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Career history entry deleted successfully"));
        }
        return ResponseEntity.notFound().build();
    }
}
