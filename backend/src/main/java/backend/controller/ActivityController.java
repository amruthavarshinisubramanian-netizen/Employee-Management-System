package backend.controller;

import backend.model.ActivityLog;
import backend.repository.ActivityLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/activities")
@CrossOrigin(origins = "*")
public class ActivityController {

    @Autowired
    private ActivityLogRepository activityRepo;

    @GetMapping
    public List<ActivityLog> getRecentActivities() {
        return activityRepo.findTop20ByOrderByIdDesc();
    }

    @PostMapping
    public ActivityLog logActivity(@RequestBody ActivityLog activity) {
        if (activity.getTimestamp() == null || activity.getTimestamp().isEmpty()) {
            activity.setTimestamp(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
        }
        return activityRepo.save(activity);
    }
}
