package com.example.todobackend.controller;

import com.example.todobackend.dto.TodoRequest;
import com.example.todobackend.dto.TodoResponse;
import com.example.todobackend.entity.Todo;
import com.example.todobackend.service.TodoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/todos")
@RequiredArgsConstructor
public class TodoController {

    private final TodoService todoService;

//    @PostMapping
//    public Todo create(@RequestBody Todo todo) {
//        return todoService.createTodo(todo);
//    }

    @PostMapping
    public TodoResponse createTodo(
            @Valid @RequestBody TodoRequest request
    ) {
        return todoService.createTodo(request);
    }


//    @GetMapping
//    public List<Todo> getMyTodos() {
//        return todoService.getMyTodos();
//    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        todoService.deleteTodo(id);
    }

    @PutMapping("/{id}")
    public Todo updateTodo(
            @PathVariable Long id,
            @RequestBody Todo todo
    ) {
        return todoService.updateTodo(id, todo);
    }


    @GetMapping
    public List<Todo> getTodos(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String before,
            @RequestParam(required = false) String after
    ) {
        return todoService.getTodosWithFilter(status, priority, sort, before, after);
    }


}
