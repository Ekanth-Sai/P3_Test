package com.example.demo.service.impl;

import com.example.demo.dto.TaskRequest;
import com.example.demo.dto.TaskResponse;
import com.example.demo.dto.TaskUpdateRequest;
import com.example.demo.entity.Task;
import com.example.demo.enums.TaskStatus;
import com.example.demo.exception.InvalidStatusTransitionException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.TaskRepository;
import com.example.demo.service.TaskService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;

    @Override
    public TaskResponse createTask(TaskRequest request) {
        log.info("Creating new task with name: {}", request.getName());

        Task task = new Task();
        task.setName(request.getName());
        task.setDescription(request.getDescription());
        task.setNotes(request.getNotes());
        task.setStatus(TaskStatus.PENDING);

        Task savedTask = taskRepository.save(task);
        log.info("Task created successfully with id: {}", savedTask.getId());

        return mapToResponse(savedTask);
    }

    @Override
    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long id) {
        log.info("Fetching task with id: {}", id);
        Task task = findTaskById(id);
        return mapToResponse(task);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TaskResponse> getAllTasks(String searchTerm, TaskStatus status, Pageable pageable) {
        log.info("Fetching tasks with searchTerm: {}, status: {}, page: {}",
                searchTerm, status, pageable.getPageNumber());

        Page<Task> tasks = taskRepository.findBySearchCriteria(searchTerm, status, pageable);
        return tasks.map(this::mapToResponse);
    }

    @Override
    public TaskResponse updateTaskStatus(Long id, TaskStatus newStatus) {
        log.info("Updating task {} status to {}", id, newStatus);

        Task task = findTaskById(id);

        if (task.getStatus() == TaskStatus.COMPLETED) {
            throw new InvalidStatusTransitionException(
                    "Cannot change status of a completed task");
        }

        if (!task.getStatus().canTransitionTo(newStatus)) {
            throw new InvalidStatusTransitionException(
                    String.format("Invalid status transition from %s to %s",
                            task.getStatus(), newStatus));
        }

        task.setStatus(newStatus);
        Task updatedTask = taskRepository.save(task);

        log.info("Task {} status updated successfully to {}", id, newStatus);
        return mapToResponse(updatedTask);
    }

    @Override
    public TaskResponse updateTaskDetails(Long id, TaskUpdateRequest request) {
        log.info("Updating task {} details", id);

        Task task = findTaskById(id);

        if (request.getName() != null && !request.getName().isBlank()) {
            task.setName(request.getName());
        }
        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }
        if (request.getNotes() != null) {
            task.setNotes(request.getNotes());
        }

        Task updatedTask = taskRepository.save(task);
        log.info("Task {} details updated successfully", id);

        return mapToResponse(updatedTask);
    }

    @Override
    public void deleteTask(Long id) {
        log.info("Deleting task with id: {}", id);

        if (!taskRepository.existsById(id)) {
            throw new ResourceNotFoundException("Task not found with id: " + id);
        }

        taskRepository.deleteById(id);
        log.info("Task {} deleted successfully", id);
    }

    private Task findTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Task not found with id: " + id));
    }

    private TaskResponse mapToResponse(Task task) {
        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setName(task.getName());
        response.setDescription(task.getDescription());
        response.setNotes(task.getNotes());
        response.setStatus(task.getStatus());
        response.setCreatedTime(task.getCreatedTime());
        response.setUpdatedTime(task.getUpdatedTime());
        return response;
    }
}
