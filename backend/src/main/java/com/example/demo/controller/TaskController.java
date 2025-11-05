package com.example.demo.controller;

import com.example.demo.dto.StatusUpdateRequest;

import com.example.demo.dto.TaskRequest;

import com.example.demo.dto.TaskResponse;

import com.example.demo.dto.TaskUpdateRequest;

import com.example.demo.enums.TaskStatus;

import com.example.demo.service.TaskService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;

import org.springframework.data.domain.PageRequest;

import org.springframework.data.domain.Pageable;

import org.springframework.data.domain.Sort;

import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;



@RestController

@RequestMapping("/api/tasks")

@RequiredArgsConstructor

@CrossOrigin(origins = "http://localhost:4200")

public class TaskController {



    private final TaskService taskService;



    @PostMapping

    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody TaskRequest request) {

        TaskResponse response = taskService.createTask(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);

    }



    @GetMapping("/{id}")

    public ResponseEntity<TaskResponse> getTaskById(@PathVariable Long id) {

        TaskResponse response = taskService.getTaskById(id);

        return ResponseEntity.ok(response);

    }



    @GetMapping

    public ResponseEntity<Page<TaskResponse>> getAllTasks(

            @RequestParam(required = false) String search,

            @RequestParam(required = false) TaskStatus status,

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "10") int size,

            @RequestParam(defaultValue = "updatedTime") String sortBy,

            @RequestParam(defaultValue = "DESC") String sortDir) {



        Sort.Direction direction = sortDir.equalsIgnoreCase("ASC")

                ? Sort.Direction.ASC

                : Sort.Direction.DESC;



        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<TaskResponse> tasks = taskService.getAllTasks(search, status, pageable);



        return ResponseEntity.ok(tasks);

    }



    @PatchMapping("/{id}/status")

    public ResponseEntity<TaskResponse> updateTaskStatus(

            @PathVariable Long id,

            @Valid @RequestBody StatusUpdateRequest request) {

        TaskResponse response = taskService.updateTaskStatus(id, request.getStatus());

        return ResponseEntity.ok(response);

    }



    @PutMapping("/{id}")

    public ResponseEntity<TaskResponse> updateTaskDetails(

            @PathVariable Long id,

            @Valid @RequestBody TaskUpdateRequest request) {

        TaskResponse response = taskService.updateTaskDetails(id, request);

        return ResponseEntity.ok(response);

    }



    @DeleteMapping("/{id}")

    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {

        taskService.deleteTask(id);

        return ResponseEntity.noContent().build();

    }

}


