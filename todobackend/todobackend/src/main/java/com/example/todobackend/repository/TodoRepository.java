package com.example.todobackend.repository;

import com.example.todobackend.entity.Todo;
import com.example.todobackend.entity.Priority;
import com.example.todobackend.entity.Status;
import com.example.todobackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TodoRepository extends JpaRepository<Todo, Long> {

    List<Todo> findByUser(User user);

    List<Todo> findByUserAndStatus(User user, Status status);

    List<Todo> findByUserAndPriority(User user, Priority priority);

    List<Todo> findByUserAndDeadlineBefore(User user, LocalDate date);

    List<Todo> findByUserAndDeadlineAfter(User user, LocalDate date);
}
