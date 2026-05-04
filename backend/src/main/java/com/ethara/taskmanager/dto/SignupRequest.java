package com.ethara.taskmanager.dto;

import com.ethara.taskmanager.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record SignupRequest(
        @NotBlank String name,
        @Email @NotBlank String email,
        @Size(min = 6, message = "Password must be at least 6 characters") String password,
        @NotNull Role role
) {
}
