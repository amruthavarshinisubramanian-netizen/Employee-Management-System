package backend.controller;

import backend.model.ActivityLog;
import backend.model.Skill;
import backend.repository.ActivityLogRepository;
import backend.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/skills")
@CrossOrigin(origins = "*")
public class SkillController {

    @Autowired
    private SkillRepository skillRepo;

    @Autowired
    private ActivityLogRepository activityRepo;

    @GetMapping("/employee/{employeeId}")
    public List<Skill> getSkillsByEmployee(@PathVariable Long employeeId) {
        return skillRepo.findByEmployeeId(employeeId);
    }

    @PostMapping
    public Skill addSkill(@RequestBody Skill skill) {
        Skill saved = skillRepo.save(skill);
        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
        activityRepo.save(new ActivityLog(null, "Skill Added",
                "Added skill " + saved.getSkillName() + " (" + saved.getProficiencyLevel() + "/5) for Employee #" + saved.getEmployeeId(),
                "HR Admin", now, "Skill"));
        return saved;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Skill> updateSkill(@PathVariable Long id, @RequestBody Skill updatedSkill) {
        return skillRepo.findById(id).map(skill -> {
            skill.setSkillName(updatedSkill.getSkillName());
            skill.setProficiencyLevel(updatedSkill.getProficiencyLevel());
            Skill saved = skillRepo.save(skill);

            String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
            activityRepo.save(new ActivityLog(null, "Skill Updated",
                    "Updated skill " + saved.getSkillName() + " to level " + saved.getProficiencyLevel() + "/5 for Employee #" + saved.getEmployeeId(),
                    "HR Admin", now, "Skill"));

            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSkill(@PathVariable Long id) {
        if (skillRepo.existsById(id)) {
            skillRepo.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Skill deleted successfully"));
        }
        return ResponseEntity.notFound().build();
    }
}
