package com.example.demo.enums;

public enum TaskStatus {
    PENDING("Pending"),
    TODO("Todo"),
    IN_PROGRESS("In Progress"),
    COMPLETED("Completed");

    private final String displayName;

    TaskStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public TaskStatus getNextStatus() {
        return switch (this) {
            case PENDING -> TODO;
            case TODO -> IN_PROGRESS;
            case IN_PROGRESS -> COMPLETED;
            case COMPLETED -> COMPLETED;
        };
    }

    public boolean canTransitionTo(TaskStatus targetStatus) {
        return switch (this) {
            case PENDING -> targetStatus == TODO;
            case TODO -> targetStatus == IN_PROGRESS;
            case IN_PROGRESS -> targetStatus == COMPLETED;
            case COMPLETED -> false;
        };
    }
}