package com.ethara.taskmanager.dto;

import com.ethara.taskmanager.entity.Priority;
import com.ethara.taskmanager.entity.TaskStatus;
import java.time.LocalDate;

public record UpdateTaskRequest(
        String title,
        String description,
        TaskStatus status,
        Priority priority,
        LocalDate dueDate,
        Long assignedUserId
) {
}
