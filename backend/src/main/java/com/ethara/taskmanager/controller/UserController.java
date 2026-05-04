package com.ethara.taskmanager.controller;

import com.ethara.taskmanager.dto.UserSummary;
import com.ethara.taskmanager.repository.UserRepository;
import com.ethara.taskmanager.service.MapperService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository userRepository;
    private final MapperService mapper;

    public UserController(UserRepository userRepository, MapperService mapper) {
        this.userRepository = userRepository;
        this.mapper = mapper;
    }

    @GetMapping
    public List<UserSummary> list() {
        return userRepository.findAll().stream().map(mapper::toUserSummary).toList();
    }
}
