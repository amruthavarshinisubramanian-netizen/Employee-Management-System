package backend.controller;

import backend.model.Notification;
import backend.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepo;

    @GetMapping
    public List<Notification> getAllNotifications() {
        return notificationRepo.findAllByOrderByIdDesc();
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id) {
        return notificationRepo.findById(id).map(notif -> {
            notif.setIsRead(true);
            return ResponseEntity.ok(notificationRepo.save(notif));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/read-all")
    public ResponseEntity<?> markAllAsRead() {
        List<Notification> list = notificationRepo.findAll();
        for (Notification n : list) {
            n.setIsRead(true);
        }
        notificationRepo.saveAll(list);
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }

    @PostMapping
    public Notification createNotification(@RequestBody Notification notification) {
        if (notification.getTimestamp() == null || notification.getTimestamp().isEmpty()) {
            notification.setTimestamp("Just now");
        }
        return notificationRepo.save(notification);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable Long id) {
        if (notificationRepo.existsById(id)) {
            notificationRepo.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Notification deleted"));
        }
        return ResponseEntity.notFound().build();
    }
}
