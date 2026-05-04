package com.ethara.taskmanager.dto;

import com.ethara.taskmanager.entity.Role;

public record AuthResponse(String token, Long id, String name, String email, Role role) {
}
