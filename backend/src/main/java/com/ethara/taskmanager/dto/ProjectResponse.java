package com.ethara.taskmanager.dto;

import java.util.List;

public record ProjectResponse(
        Long id,
        String name,
        String description,
        List<UserSummary> members,
        int taskCount
) {
}
