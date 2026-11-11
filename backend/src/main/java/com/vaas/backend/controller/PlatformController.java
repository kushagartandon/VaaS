package com.vaas.backend.controller;

import com.vaas.backend.dto.AddReviewRequest;
import com.vaas.backend.dto.PlatformOnboardRequest;
import com.vaas.backend.dto.PlatformOnboardResponse;
import com.vaas.backend.dto.ReviewSummaryDTO;
import com.vaas.backend.dto.WorkerPassportDTO;
import com.vaas.backend.model.User;
import com.vaas.backend.repository.UserRepository;
import com.vaas.backend.service.ReputationService;
import com.vaas.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/platform")
public class PlatformController {

    private final UserService userService;
    private final ReputationService reputationService;
    private final UserRepository userRepository;

    public PlatformController(
            UserService userService,
            ReputationService reputationService,
            UserRepository userRepository) {
        this.userService = userService;
        this.reputationService = reputationService;
        this.userRepository = userRepository;
    }

    /**
     * B2B Platform Onboarding:
     * Used by Uber, Ola, Urban Company, Zomato, etc. to onboard or query an incoming gig worker.
     */
    @PostMapping("/onboard")
    public ResponseEntity<PlatformOnboardResponse> onboardWorker(
            @Valid @RequestBody PlatformOnboardRequest request) {
        PlatformOnboardResponse response = userService.onboardWorkerFromPlatform(request);
        HttpStatus status = response.isNewWorker() ? HttpStatus.CREATED : HttpStatus.OK;
        return ResponseEntity.status(status).body(response);
    }

    /**
     * Post a review or safety incident report for a worker from a specific platform.
     */
    @PostMapping("/review")
    public ResponseEntity<ReviewSummaryDTO> submitReview(
            @Valid @RequestBody AddReviewRequest request) {
        User user = null;

        if (request.getDid() != null && !request.getDid().isBlank()) {
            user = userRepository.findByDid(request.getDid().trim())
                    .orElse(null);
        }

        if (user == null && request.getPhone() != null && !request.getPhone().isBlank()) {
            user = userRepository.findByPhone(request.getPhone().trim())
                    .orElse(null);
        }

        if (user == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Worker not found for the provided DID or phone number."
            );
        }

        ReviewSummaryDTO reviewSummary = reputationService.addReview(request, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(reviewSummary);
    }

    /**
     * Query full worker passport by DID.
     */
    @GetMapping("/worker/{did}")
    public ResponseEntity<WorkerPassportDTO> getWorkerByDid(@PathVariable String did) {
        return userService.getWorkerPassportByDid(did)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Query full worker passport by Phone.
     */
    @GetMapping("/worker/phone/{phone}")
    public ResponseEntity<WorkerPassportDTO> getWorkerByPhone(@PathVariable String phone) {
        return userService.getWorkerPassportByPhone(phone)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

