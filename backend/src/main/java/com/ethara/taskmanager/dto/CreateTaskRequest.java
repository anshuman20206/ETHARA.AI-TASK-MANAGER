package com.ethara.taskmanager.dto;

import com.ethara.taskmanager.entity.Priority;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record CreateTaskRequest(
        @NotBlank String title,
        String description,
        @NotNull Priority priority,
        @NotNull @FutureOrPresent LocalDate dueDate,
        @NotNull Long projectId,
        @NotNull Long assignedUserId
) {
}
