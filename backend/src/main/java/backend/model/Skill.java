package backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "skills")
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long employeeId;
    private String skillName;
    private Integer proficiencyLevel; // 1 = Beginner, 2 = Basic, 3 = Intermediate, 4 = Advanced, 5 = Expert

    public Skill() {
    }

    public Skill(Long id, Long employeeId, String skillName, Integer proficiencyLevel) {
        this.id = id;
        this.employeeId = employeeId;
        this.skillName = skillName;
        this.proficiencyLevel = proficiencyLevel;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public String getSkillName() {
        return skillName;
    }

    public void setSkillName(String skillName) {
        this.skillName = skillName;
    }

    public Integer getProficiencyLevel() {
        return proficiencyLevel != null ? proficiencyLevel : 3;
    }

    public void setProficiencyLevel(Integer proficiencyLevel) {
        this.proficiencyLevel = proficiencyLevel;
    }

    public String getLevelLabel() {
        if (proficiencyLevel == null) return "Intermediate";
        switch (proficiencyLevel) {
            case 1: return "Beginner";
            case 2: return "Basic";
            case 3: return "Intermediate";
            case 4: return "Advanced";
            case 5: return "Expert";
            default: return "Intermediate";
        }
    }
}
