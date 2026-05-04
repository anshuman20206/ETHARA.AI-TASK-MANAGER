package com.ethara.taskmanager.repository;

import com.ethara.taskmanager.entity.Priority;
import com.ethara.taskmanager.entity.Task;
import com.ethara.taskmanager.entity.TaskStatus;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TaskRepository extends JpaRepository<Task, Long> {
    @EntityGraph(attributePaths = {"project", "assignedUser"})
    List<Task> findAllByOrderByDueDateAsc();

    @EntityGraph(attributePaths = {"project", "assignedUser"})
    List<Task> findByAssignedUserIdOrderByDueDateAsc(Long userId);

    @EntityGraph(attributePaths = {"project", "assignedUser"})
    List<Task> findByProjectIdOrderByDueDateAsc(Long projectId);

    @EntityGraph(attributePaths = {"project", "assignedUser"})
    List<Task> findByAssignedUserIdAndProjectIdOrderByDueDateAsc(Long userId, Long projectId);

    @EntityGraph(attributePaths = {"project", "assignedUser"})
    @Query("""
            select t from Task t
            where (:status is null or t.status = :status)
              and (:priority is null or t.priority = :priority)
            order by t.dueDate asc
            """)
    List<Task> findFiltered(@Param("status") TaskStatus status, @Param("priority") Priority priority);

    @EntityGraph(attributePaths = {"project", "assignedUser"})
    @Query("""
            select t from Task t
            where t.assignedUser.id = :userId
              and (:status is null or t.status = :status)
              and (:priority is null or t.priority = :priority)
            order by t.dueDate asc
            """)
    List<Task> findFilteredForUser(@Param("userId") Long userId, @Param("status") TaskStatus status, @Param("priority") Priority priority);

    @EntityGraph(attributePaths = {"project", "assignedUser"})
    List<Task> findByDueDateBeforeAndStatusNotOrderByDueDateAsc(LocalDate dueDate, TaskStatus status);

    @EntityGraph(attributePaths = {"project", "assignedUser"})
    List<Task> findByAssignedUserIdAndDueDateBeforeAndStatusNotOrderByDueDateAsc(Long userId, LocalDate dueDate, TaskStatus status);
}
