package backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "activity_logs")
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String action; // e.g., Employee Added, Leave Approved, Goal Updated, Performance Updated
    private String description;
    private String performedBy = "HR Admin";
    private String timestamp; // e.g. 2026-09-27 10:30 AM
    private String category; // Employee, Leave, Performance, Goal, System

    public ActivityLog() {
    }

    public ActivityLog(Long id, String action, String description, String performedBy, String timestamp, String category) {
        this.id = id;
        this.action = action;
        this.description = description;
        this.performedBy = performedBy != null ? performedBy : "HR Admin";
        this.timestamp = timestamp;
        this.category = category;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPerformedBy() {
        return performedBy;
    }

    public void setPerformedBy(String performedBy) {
        this.performedBy = performedBy;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}
