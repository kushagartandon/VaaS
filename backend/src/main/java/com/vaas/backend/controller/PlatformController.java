package com.vaas.backend.controller;

import com.vaas.backend.dto.*;
import com.vaas.backend.model.PartnerPlatform;
import com.vaas.backend.model.User;
import com.vaas.backend.repository.PartnerPlatformRepository;
import com.vaas.backend.repository.UserRepository;
import com.vaas.backend.security.ApiKeyAuthFilter;
import com.vaas.backend.service.ReputationService;
import com.vaas.backend.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/platform")
public class PlatformController {

    private final UserService userService;
    private final ReputationService reputationService;
    private final UserRepository userRepository;
    private final PartnerPlatformRepository partnerPlatformRepository;

    public PlatformController(
            UserService userService,
            ReputationService reputationService,
            UserRepository userRepository,
            PartnerPlatformRepository partnerPlatformRepository) {
        this.userService = userService;
        this.reputationService = reputationService;
        this.userRepository = userRepository;
        this.partnerPlatformRepository = partnerPlatformRepository;
    }

    /**
     * Public Developer / Sandbox endpoint:
     * Returns the pre-seeded platform API keys for testing in the sandbox portal.
     */
    @GetMapping("/keys")
    public ResponseEntity<List<PlatformKeyInfoDTO>> getAvailableKeys() {
        List<PlatformKeyInfoDTO> keys = partnerPlatformRepository.findAll().stream()
                .map(p -> PlatformKeyInfoDTO.builder()
                        .name(p.getName())
                        .apiKey(p.getApiKey())
                        .environment(p.getEnvironment())
                        .active(p.isActive())
                        .lastUsedAt(p.getLastUsedAt())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(keys);
    }

    /**
     * B2B Platform Onboarding:
     * Requires valid X-API-Key or Bearer token header.
     * Platform name is strictly bound to the authenticated API key.
     */
    @PostMapping("/onboard")
    public ResponseEntity<PlatformOnboardResponse> onboardWorker(
            @Valid @RequestBody PlatformOnboardRequest requestDto,
            HttpServletRequest request) {

        PartnerPlatform platform = (PartnerPlatform) request.getAttribute(ApiKeyAuthFilter.AUTHENTICATED_PLATFORM_ATTR);
        if (platform != null) {
            // Guarantee platform identity from authenticated API key
            requestDto.setPlatformName(platform.getName());
        }

        PlatformOnboardResponse response = userService.onboardWorkerFromPlatform(requestDto);
        HttpStatus status = response.isNewWorker() ? HttpStatus.CREATED : HttpStatus.OK;
        return ResponseEntity.status(status).body(response);
    }

    /**
     * Post a review or safety incident report for a worker from the authenticated platform.
     * Requires valid X-API-Key or Bearer token header.
     */
    @PostMapping("/review")
    public ResponseEntity<ReviewSummaryDTO> submitReview(
            @Valid @RequestBody AddReviewRequest requestDto,
            HttpServletRequest request) {

        PartnerPlatform platform = (PartnerPlatform) request.getAttribute(ApiKeyAuthFilter.AUTHENTICATED_PLATFORM_ATTR);
        if (platform != null) {
            // Strictly bind review authorship to authenticated platform
            requestDto.setPlatformName(platform.getName());
        }

        User user = null;

        if (requestDto.getDid() != null && !requestDto.getDid().isBlank()) {
            user = userRepository.findByDid(requestDto.getDid().trim())
                    .orElse(null);
        }

        if (user == null && requestDto.getPhone() != null && !requestDto.getPhone().isBlank()) {
            user = userRepository.findByPhone(requestDto.getPhone().trim())
                    .orElse(null);
        }

        if (user == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Worker not found for the provided DID or phone number."
            );
        }

        ReviewSummaryDTO reviewSummary = reputationService.addReview(requestDto, user);
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

