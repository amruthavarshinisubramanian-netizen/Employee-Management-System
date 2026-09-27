package backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "employee")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String department;
    private String phone;
    private String designation;
    private String location;
    private String dateOfJoining;
    private Double salary;
    private String status = "Active"; // Active, On Leave, Inactive
    private Integer performanceScore = 4; // 1-5
    private String performanceLevel = "Very Good"; // Needs Improvement, Developing, Meets Expectations, Very Good, Excellent
    private String managerFeedback;
    private String lastReviewDate;
    private String reportingManager;
    private String avatarUrl;

    public Employee() {
    }

    public Employee(Long id, String name, String email, String department, String phone,
                    String designation, String location, String dateOfJoining, Double salary,
                    String status, Integer performanceScore, String managerFeedback,
                    String lastReviewDate, String reportingManager, String avatarUrl) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.department = department;
        this.phone = phone;
        this.designation = designation;
        this.location = location;
        this.dateOfJoining = dateOfJoining;
        this.salary = salary;
        this.status = status != null ? status : "Active";
        setPerformanceScore(performanceScore != null ? performanceScore : 3);
        this.managerFeedback = managerFeedback;
        this.lastReviewDate = lastReviewDate;
        this.reportingManager = reportingManager;
        this.avatarUrl = avatarUrl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDateOfJoining() {
        return dateOfJoining;
    }

    public void setDateOfJoining(String dateOfJoining) {
        this.dateOfJoining = dateOfJoining;
    }

    public Double getSalary() {
        return salary;
    }

    public void setSalary(Double salary) {
        this.salary = salary;
    }

    public String getStatus() {
        return status != null ? status : "Active";
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getPerformanceScore() {
        return performanceScore != null ? performanceScore : 3;
    }

    public void setPerformanceScore(Integer performanceScore) {
        this.performanceScore = performanceScore;
        this.performanceLevel = calculatePerformanceLevel(performanceScore);
    }

    public String getPerformanceLevel() {
        if (performanceLevel == null && performanceScore != null) {
            performanceLevel = calculatePerformanceLevel(performanceScore);
        }
        return performanceLevel != null ? performanceLevel : "Meets Expectations";
    }

    public void setPerformanceLevel(String performanceLevel) {
        this.performanceLevel = performanceLevel;
    }

    public String getManagerFeedback() {
        return managerFeedback;
    }

    public void setManagerFeedback(String managerFeedback) {
        this.managerFeedback = managerFeedback;
    }

    public String getLastReviewDate() {
        return lastReviewDate;
    }

    public void setLastReviewDate(String lastReviewDate) {
        this.lastReviewDate = lastReviewDate;
    }

    public String getReportingManager() {
        return reportingManager;
    }

    public void setReportingManager(String reportingManager) {
        this.reportingManager = reportingManager;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public static String calculatePerformanceLevel(Integer score) {
        if (score == null) return "Meets Expectations";
        switch (score) {
            case 5:
                return "Excellent";
            case 4:
                return "Very Good";
            case 3:
                return "Meets Expectations";
            case 2:
                return "Developing";
            case 1:
                return "Needs Improvement";
            default:
                return score > 5 ? "Excellent" : "Needs Improvement";
        }
    }
}