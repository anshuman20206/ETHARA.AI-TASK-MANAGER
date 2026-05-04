package com.ethara.taskmanager.service;

import com.ethara.taskmanager.entity.Role;
import com.ethara.taskmanager.security.CustomUserDetails;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {
    public CustomUserDetails current() {
        return (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public boolean isAdmin() {
        return current().getRole() == Role.ADMIN;
    }
}
