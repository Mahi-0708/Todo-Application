package com.example.todobackend.controller;

import com.example.todobackend.dto.GoogleLoginRequest;
import com.example.todobackend.dto.LoginRequest;
import com.example.todobackend.dto.LoginResponse;
import com.example.todobackend.dto.SignupRequest;
import com.example.todobackend.model.User;
import com.example.todobackend.service.AuthService;
import com.example.todobackend.service.GoogleAuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
//@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;
    private final GoogleAuthService googleAuthService;

    @PostMapping("/signup")
    public ResponseEntity<User> signup(@Valid @RequestBody SignupRequest request) {
        return new ResponseEntity<>(authService.signup(request), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/google")
    public Map<String, String> googleLogin(
            @RequestBody GoogleLoginRequest request
    ) throws Exception {

        String jwt = googleAuthService.loginWithGoogle(request.getToken());

        return Map.of("token", jwt);
    }

}

