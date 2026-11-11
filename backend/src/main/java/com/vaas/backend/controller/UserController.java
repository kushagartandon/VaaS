package com.vaas.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.vaas.backend.dto.UserRegistrationRequest;
import com.vaas.backend.dto.UserResponse;
import com.vaas.backend.dto.VerifyResponse;
import com.vaas.backend.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
@Tag(name = "Worker Self-Service & Public Verification", description = "Endpoints for worker self-registration and public DID verification.")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "Worker self-registration", description = "Allows a gig worker to self-register and receive a personal universal DID.")
    @PostMapping("/register")
    public ResponseEntity<UserResponse> registerUser(@Valid @RequestBody UserRegistrationRequest request) {
        UserResponse response = userService.registerUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Get worker by phone", description = "Fetch worker profile by phone number.")
    @GetMapping("/user/{phone}")
    public ResponseEntity<UserResponse> getUserByPhone(
            @Parameter(description = "10-digit phone number") @PathVariable String phone) {
        return userService.getUserByPhone(phone)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Get worker by DID", description = "Fetch worker profile by universal DID.")
    @GetMapping("/user/did/{did}")
    public ResponseEntity<UserResponse> getUserByDid(
            @Parameter(description = "Universal Decentralized Identifier (e.g. did:vaas:...)") @PathVariable String did) {
        return userService.getUserByDid(did)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Public DID verification check", description = "Public verification endpoint used by QR code scanners and customers to verify a worker's active DID validity.")
    @GetMapping("/verify/{did}")
    public ResponseEntity<VerifyResponse> verifyDid(
            @Parameter(description = "Universal Decentralized Identifier (e.g. did:vaas:...)") @PathVariable String did) {
        VerifyResponse response = userService.verifyDid(did);
        if (!response.isVerified()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        return ResponseEntity.ok(response);
    }
}
