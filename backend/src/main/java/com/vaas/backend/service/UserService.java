package com.vaas.backend.service;

import java.util.Optional;

import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.vaas.backend.dto.UserRegistrationRequest;
import com.vaas.backend.dto.UserResponse;
import com.vaas.backend.dto.VerifyResponse;
import com.vaas.backend.model.User;
import com.vaas.backend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserResponse registerUser(UserRegistrationRequest request) {
        String phone = request.getPhone().trim();

        // Check for duplicate phone number
        if (userRepository.findByPhone(phone).isPresent()) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "A worker with phone number " + phone + " is already registered."
            );
        }

        // Sanitize Aadhaar to last 4 digits
        String aadhaarInput = request.getAadhaarLast4().trim();
        String aadhaarLast4 = aadhaarInput.length() > 4
                ? aadhaarInput.substring(aadhaarInput.length() - 4)
                : aadhaarInput;

        // Generate deterministic DID (based on Aadhaar last 4 + Phone + WorkType)
        String didHash = DigestUtils.sha256Hex(aadhaarLast4 + phone + request.getWorkType().trim());
        String did = "did:vaas:" + didHash;

        // Check if DID already exists
        if (userRepository.findByDid(did).isPresent()) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "An identity for these credentials already exists."
            );
        }

        User user = User.builder()
                .name(request.getName().trim())
                .phone(phone)
                .aadhaarLast4(aadhaarLast4)
                .pan(request.getPan() != null ? request.getPan().trim() : null)
                .workType(request.getWorkType().trim())
                .platformId(request.getPlatformId().trim())
                .did(did)
                .build();

        User savedUser = userRepository.save(user);
        return mapToResponse(savedUser);
    }

    public Optional<UserResponse> getUserByPhone(String phone) {
        return userRepository.findByPhone(phone).map(this::mapToResponse);
    }

    public Optional<UserResponse> getUserByDid(String did) {
        return userRepository.findByDid(did).map(this::mapToResponse);
    }

    public VerifyResponse verifyDid(String did) {
        return userRepository.findByDid(did)
                .map(user -> VerifyResponse.builder()
                        .verified(true)
                        .did(user.getDid())
                        .name(user.getName())
                        .workType(user.getWorkType())
                        .platformId(user.getPlatformId())
                        .message("DID is valid and actively verified.")
                        .build())
                .orElseGet(() -> VerifyResponse.builder()
                        .verified(false)
                        .did(did)
                        .message("DID not found or invalid.")
                        .build());
    }

    public UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .phone(user.getPhone())
                .aadhaarLast4(user.getAadhaarLast4())
                .workType(user.getWorkType())
                .platformId(user.getPlatformId())
                .did(user.getDid())
                .qrCodePath(user.getQrCodePath())
                .build();
    }
}
