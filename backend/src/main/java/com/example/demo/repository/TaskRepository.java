package com.example.demo.repository;

import com.example.demo.entity.Task;
import com.example.demo.enums.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

        @Query("""
                        SELECT t FROM Task t
                        WHERE
                        (:searchTerm IS NULL OR
                        LOWER(t.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR
                        LOWER(t.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR
                        LOWER(t.notes) LIKE LOWER(CONCAT('%', :searchTerm, '%')))
                        AND
                        (:status IS NULL OR t.status = :status)
                        """)
        Page<Task> findBySearchCriteria(
                        @Param("searchTerm") String searchTerm,
                        @Param("status") TaskStatus status,
                        Pageable pageable);
}
