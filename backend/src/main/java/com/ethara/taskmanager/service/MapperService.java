package com.ethara.taskmanager.service;

import com.ethara.taskmanager.dto.ProjectResponse;
import com.ethara.taskmanager.dto.TaskResponse;
import com.ethara.taskmanager.dto.UserSummary;
import com.ethara.taskmanager.entity.Project;
import com.ethara.taskmanager.entity.Task;
import com.ethara.taskmanager.entity.TaskStatus;
import com.ethara.taskmanager.entity.User;
import java.time.LocalDate;
import java.util.Comparator;
import org.springframework.stereotype.Service;

@Service
public class MapperService {
    public UserSummary toUserSummary(User user) {
        return new UserSummary(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }

    public ProjectResponse toProjectResponse(Project project) {
        return new ProjectResponse(
                project.getId(),
                project.getName(),
                project.getDescription(),
                project.getMembers().stream()
                        .sorted(Comparator.comparing(User::getName))
                        .map(this::toUserSummary)
                        .toList(),
                project.getTasks().size()
        );
    }

    public TaskResponse toTaskResponse(Task task) {
        boolean overdue = task.getDueDate().isBefore(LocalDate.now()) && task.getStatus() != TaskStatus.DONE;
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getPriority(),
                task.getDueDate(),
                overdue,
                task.getProject().getId(),
                task.getProject().getName(),
                toUserSummary(task.getAssignedUser())
        );
    }
}
