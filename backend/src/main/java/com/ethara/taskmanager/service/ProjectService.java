package com.ethara.taskmanager.service;

import com.ethara.taskmanager.dto.AddMembersRequest;
import com.ethara.taskmanager.dto.CreateProjectRequest;
import com.ethara.taskmanager.dto.ProjectResponse;
import com.ethara.taskmanager.entity.Project;
import com.ethara.taskmanager.entity.User;
import com.ethara.taskmanager.exception.ForbiddenException;
import com.ethara.taskmanager.exception.ResourceNotFoundException;
import com.ethara.taskmanager.repository.ProjectRepository;
import com.ethara.taskmanager.repository.UserRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;
    private final MapperService mapper;

    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository, CurrentUserService currentUserService, MapperService mapper) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.currentUserService = currentUserService;
        this.mapper = mapper;
    }

    @Transactional
    public ProjectResponse create(CreateProjectRequest request) {
        requireAdmin();
        Project project = new Project();
        project.setName(request.name());
        project.setDescription(request.description());
        User creator = userRepository.findById(currentUserService.current().getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        project.getMembers().add(creator);
        return mapper.toProjectResponse(projectRepository.save(project));
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> list() {
        if (currentUserService.isAdmin()) {
            return projectRepository.findAll().stream().map(mapper::toProjectResponse).toList();
        }
        return projectRepository.findByMemberId(currentUserService.current().getId()).stream()
                .map(mapper::toProjectResponse)
                .toList();
    }

    @Transactional
    public ProjectResponse addMembers(Long projectId, AddMembersRequest request) {
        requireAdmin();
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        List<User> users = userRepository.findAllById(request.userIds());
        if (users.size() != request.userIds().size()) {
            throw new ResourceNotFoundException("One or more users were not found");
        }
        project.getMembers().addAll(users);
        return mapper.toProjectResponse(projectRepository.save(project));
    }

    private void requireAdmin() {
        if (!currentUserService.isAdmin()) {
            throw new ForbiddenException("Only admins can manage projects");
        }
    }
}
