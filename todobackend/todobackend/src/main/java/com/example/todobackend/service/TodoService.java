package com.example.todobackend.service;

import com.example.todobackend.dto.TodoRequest;
import com.example.todobackend.dto.TodoResponse;
import com.example.todobackend.entity.Priority;
import com.example.todobackend.entity.Status;
import com.example.todobackend.entity.Todo;
import com.example.todobackend.model.User;
import com.example.todobackend.repository.TodoRepository;
import com.example.todobackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TodoService {

    private final TodoRepository todoRepository;
    private final UserRepository userRepository;

    // get logged-in user from JWT
    private User getCurrentUser() {
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // create todo
    public TodoResponse createTodo(TodoRequest request) {

        Todo todo = new Todo();   // entity created INSIDE service

        todo.setTitle(request.getTitle());
        todo.setDescription(request.getDescription());
        todo.setStatus(request.getStatus());
        todo.setPriority(request.getPriority());
        todo.setDeadline(request.getDeadline());
        todo.setUser(getCurrentUser());

        return mapToResponse(todoRepository.save(todo));
    }



    // get all todos of user
    public List<Todo> getMyTodos() {
        return todoRepository.findByUser(getCurrentUser());
    }

    // delete todo
    public void deleteTodo(Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Todo not found"));

        if (!todo.getUser().getId().equals(getCurrentUser().getId())) {
            throw new RuntimeException("Unauthorized");
        }

        todoRepository.delete(todo);
    }


    public Todo updateTodo(Long id, Todo updatedTodo) {

        Todo existingTodo = todoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Todo not found"));

        // ensure user owns the todo
        if (!existingTodo.getUser().getId().equals(getCurrentUser().getId())) {
            throw new RuntimeException("Unauthorized");
        }

        existingTodo.setTitle(updatedTodo.getTitle());
        existingTodo.setDescription(updatedTodo.getDescription());
        existingTodo.setStatus(updatedTodo.getStatus());
        existingTodo.setPriority(updatedTodo.getPriority());

        return todoRepository.save(existingTodo);
    }


    public List<Todo> getTodosWithFilter(String status, String priority, String sort) {

        User user = getCurrentUser();
        List<Todo> todos;

        if (status != null) {
            todos = todoRepository.findByUserAndStatus(
                    user,
                    Status.valueOf(status)
            );
        } else if (priority != null) {
            todos = todoRepository.findByUserAndPriority(
                    user,
                    Priority.valueOf(priority)
            );
        } else {
            todos = todoRepository.findByUser(user);
        }

        if ("priority".equalsIgnoreCase(sort)) {
            todos.sort((a, b) -> a.getPriority().compareTo(b.getPriority()));
        }

        return todos;
    }


    public List<Todo> getTodosWithFilter(
            String status,
            String priority,
            String sort,
            String before,
            String after
    ) {

        User user = getCurrentUser();
        List<Todo> todos;

        if (before != null) {
            todos = todoRepository.findByUserAndDeadlineBefore(
                    user,
                    LocalDate.parse(before)
            );
        } else if (after != null) {
            todos = todoRepository.findByUserAndDeadlineAfter(
                    user,
                    LocalDate.parse(after)
            );
        } else if (status != null) {
            todos = todoRepository.findByUserAndStatus(
                    user,
                    Status.valueOf(status)
            );
        } else if (priority != null) {
            todos = todoRepository.findByUserAndPriority(
                    user,
                    Priority.valueOf(priority)
            );
        } else {
            todos = todoRepository.findByUser(user);
        }

        if ("deadline".equalsIgnoreCase(sort)) {
            todos.sort((a, b) -> a.getDeadline().compareTo(b.getDeadline()));
        }

        return todos;
    }

    private TodoResponse mapToResponse(Todo todo) {
        TodoResponse res = new TodoResponse();
        res.setId(todo.getId());
        res.setTitle(todo.getTitle());
        res.setDescription(todo.getDescription());
        res.setStatus(todo.getStatus());
        res.setPriority(todo.getPriority());
        res.setDeadline(todo.getDeadline());
        return res;
    }


}
