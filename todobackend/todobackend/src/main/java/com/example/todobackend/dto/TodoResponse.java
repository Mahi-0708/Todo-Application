package com.example.todobackend.dto;

import com.example.todobackend.entity.Priority;
import com.example.todobackend.entity.Status;

import java.time.LocalDate;

public class TodoResponse {

    private Long id;
    private String title;
    private String description;
    private Status status;
    private Priority priority;
    private LocalDate deadline;

    // getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }
}
