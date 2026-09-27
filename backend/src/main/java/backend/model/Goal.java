package backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "goals")
public class Goal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long employeeId;
    private String title;
    private String description;
    private String startDate;
    private String targetDate;
    private Integer progress = 0; // 0 - 100%
    private String status = "Not Started"; // Not Started, In Progress, Completed

    public Goal() {
    }

    public Goal(Long id, Long employeeId, String title, String description,
                String startDate, String targetDate, Integer progress, String status) {
        this.id = id;
        this.employeeId = employeeId;
        this.title = title;
        this.description = description;
        this.startDate = startDate;
        this.targetDate = targetDate;
        this.progress = progress != null ? progress : 0;
        this.status = status != null ? status : "Not Started";
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getTargetDate() {
        return targetDate;
    }

    public void setTargetDate(String targetDate) {
        this.targetDate = targetDate;
    }

    public Integer getProgress() {
        return progress != null ? progress : 0;
    }

    public void setProgress(Integer progress) {
        this.progress = progress != null ? progress : 0;
        if (this.progress >= 100) {
            this.status = "Completed";
        } else if (this.progress > 0 && !"Completed".equals(this.status)) {
            this.status = "In Progress";
        }
    }

    public String getStatus() {
        return status != null ? status : "Not Started";
    }

    public void setStatus(String status) {
        this.status = status;
        if ("Completed".equals(status) && (progress == null || progress < 100)) {
            this.progress = 100;
        }
    }
}
