package com.ethara.taskmanager.service;

import com.ethara.taskmanager.dto.CreateTaskRequest;
import com.ethara.taskmanager.dto.TaskResponse;
import com.ethara.taskmanager.dto.UpdateTaskRequest;
import com.ethara.taskmanager.entity.Priority;
import com.ethara.taskmanager.entity.Project;
import com.ethara.taskmanager.entity.Task;
import com.ethara.taskmanager.entity.TaskStatus;
import com.ethara.taskmanager.entity.User;
import com.ethara.taskmanager.exception.BadRequestException;
import com.ethara.taskmanager.exception.ForbiddenException;
import com.ethara.taskmanager.exception.ResourceNotFoundException;
import com.ethara.taskmanager.repository.ProjectRepository;
import com.ethara.taskmanager.repository.TaskRepository;
import com.ethara.taskmanager.repository.UserRepository;
import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TaskService {
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;
    private final MapperService mapper;

    public TaskService(TaskRepository taskRepository, ProjectRepository projectRepository, UserRepository userRepository, CurrentUserService currentUserService, MapperService mapper) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.currentUserService = currentUserService;
        this.mapper = mapper;
    }

    @Transactional
    public TaskResponse create(CreateTaskRequest request) {
        requireAdmin("Only admins can create tasks");
        Project project = projectRepository.findById(request.projectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        User assignedUser = userRepository.findById(request.assignedUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Assigned user not found"));
        if (!isProjectMember(project, assignedUser.getId())) {
            throw new BadRequestException("Assigned user must be a project member");
        }

        Task task = new Task();
        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setPriority(request.priority());
        task.setDueDate(request.dueDate());
        task.setStatus(TaskStatus.TODO);
        task.setProject(project);
        task.setAssignedUser(assignedUser);
        return mapper.toTaskResponse(taskRepository.save(task));
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> list(TaskStatus status, Priority priority, Long projectId) {
        List<Task> tasks;
        if (projectId != null) {
            tasks = currentUserService.isAdmin()
                    ? taskRepository.findByProjectIdOrderByDueDateAsc(projectId)
                    : taskRepository.findByAssignedUserIdAndProjectIdOrderByDueDateAsc(currentUserService.current().getId(), projectId);
        } else if (currentUserService.isAdmin()) {
            tasks = taskRepository.findFiltered(status, priority);
        } else {
            tasks = taskRepository.findFilteredForUser(currentUserService.current().getId(), status, priority);
        }
        return tasks.stream()
                .filter(task -> status == null || task.getStatus() == status)
                .filter(task -> priority == null || task.getPriority() == priority)
                .map(mapper::toTaskResponse)
                .toList();
    }

    @Transactional
    public TaskResponse update(Long taskId, UpdateTaskRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (currentUserService.isAdmin()) {
            updateAdminFields(task, request);
        } else {
            if (!task.getAssignedUser().getId().equals(currentUserService.current().getId())) {
                throw new ForbiddenException("Members can only update their assigned tasks");
            }
            if (request.status() == null) {
                throw new BadRequestException("Members can update task status only");
            }
            task.setStatus(request.status());
        }
        return mapper.toTaskResponse(taskRepository.save(task));
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> overdue() {
        List<Task> tasks = currentUserService.isAdmin()
                ? taskRepository.findByDueDateBeforeAndStatusNotOrderByDueDateAsc(LocalDate.now(), TaskStatus.DONE)
                : taskRepository.findByAssignedUserIdAndDueDateBeforeAndStatusNotOrderByDueDateAsc(
                        currentUserService.current().getId(),
                        LocalDate.now(),
                        TaskStatus.DONE
                );
        return tasks.stream().map(mapper::toTaskResponse).toList();
    }

    private void updateAdminFields(Task task, UpdateTaskRequest request) {
        if (request.title() != null) {
            task.setTitle(request.title());
        }
        if (request.description() != null) {
            task.setDescription(request.description());
        }
        if (request.status() != null) {
            task.setStatus(request.status());
        }
        if (request.priority() != null) {
            task.setPriority(request.priority());
        }
        if (request.dueDate() != null) {
            task.setDueDate(request.dueDate());
        }
        if (request.assignedUserId() != null) {
            User assignedUser = userRepository.findById(request.assignedUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assigned user not found"));
            if (!isProjectMember(task.getProject(), assignedUser.getId())) {
                throw new BadRequestException("Assigned user must be a project member");
            }
            task.setAssignedUser(assignedUser);
        }
    }

    private void requireAdmin(String message) {
        if (!currentUserService.isAdmin()) {
            throw new ForbiddenException(message);
        }
    }

    private boolean isProjectMember(Project project, Long userId) {
        return project.getMembers().stream().anyMatch(member -> member.getId().equals(userId));
    }
}
