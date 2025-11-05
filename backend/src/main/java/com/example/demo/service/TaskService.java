package com.example.demo.service;

import com.example.demo.dto.TaskRequest;
import com.example.demo.dto.TaskResponse;
import com.example.demo.dto.TaskUpdateRequest;
import com.example.demo.enums.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TaskService {
    TaskResponse createTask(TaskRequest request);

    TaskResponse getTaskById(Long id);

    Page<TaskResponse> getAllTasks(String searchTerm, TaskStatus status, Pageable pageable);

    TaskResponse updateTaskStatus(Long id, TaskStatus newStatus);

    TaskResponse updateTaskDetails(Long id, TaskUpdateRequest request);

    void deleteTask(Long id);
}
