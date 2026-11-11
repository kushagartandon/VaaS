package com.vaas.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.vaas.backend.dto.UserRegistrationRequest;
import com.vaas.backend.dto.UserResponse;
import com.vaas.backend.dto.VerifyResponse;
import com.vaas.backend.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> registerUser(@Valid @RequestBody UserRegistrationRequest request) {
        UserResponse response = userService.registerUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/user/{phone}")
    public ResponseEntity<UserResponse> getUserByPhone(@PathVariable String phone) {
        return userService.getUserByPhone(phone)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/did/{did}")
    public ResponseEntity<UserResponse> getUserByDid(@PathVariable String did) {
        return userService.getUserByDid(did)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/verify/{did}")
    public ResponseEntity<VerifyResponse> verifyDid(@PathVariable String did) {
        VerifyResponse response = userService.verifyDid(did);
        if (!response.isVerified()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        return ResponseEntity.ok(response);
    }
}
