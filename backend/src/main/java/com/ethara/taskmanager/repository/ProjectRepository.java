package com.ethara.taskmanager.repository;

import com.ethara.taskmanager.entity.Project;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    @EntityGraph(attributePaths = {"members", "tasks"})
    List<Project> findAll();

    @EntityGraph(attributePaths = {"members", "tasks"})
    @Query("select distinct p from Project p join p.members m where m.id = :userId")
    List<Project> findByMemberId(@Param("userId") Long userId);
}
