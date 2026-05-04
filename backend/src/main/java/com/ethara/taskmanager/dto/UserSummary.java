package com.ethara.taskmanager.dto;

import com.ethara.taskmanager.entity.Role;

public record UserSummary(Long id, String name, String email, Role role) {
}
