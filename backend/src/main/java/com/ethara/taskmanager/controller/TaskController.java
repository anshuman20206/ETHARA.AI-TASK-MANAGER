package com.ethara.taskmanager.controller;

import com.ethara.taskmanager.dto.CreateTaskRequest;
import com.ethara.taskmanager.dto.TaskResponse;
import com.ethara.taskmanager.dto.UpdateTaskRequest;
import com.ethara.taskmanager.entity.Priority;
import com.ethara.taskmanager.entity.TaskStatus;
import com.ethara.taskmanager.service.TaskService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TaskResponse create(@Valid @RequestBody CreateTaskRequest request) {
        return taskService.create(request);
    }

    @GetMapping
    public List<TaskResponse> list(
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) Long projectId
    ) {
        return taskService.list(status, priority, projectId);
    }

    @PutMapping("/{id}")
    public TaskResponse update(@PathVariable Long id, @RequestBody UpdateTaskRequest request) {
        return taskService.update(id, request);
    }

    @GetMapping("/overdue")
    public List<TaskResponse> overdue() {
        return taskService.overdue();
    }
}
