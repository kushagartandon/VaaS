package com.vaas.backend.controller;

import com.vaas.backend.dto.*;
import com.vaas.backend.model.PartnerPlatform;
import com.vaas.backend.model.User;
import com.vaas.backend.repository.PartnerPlatformRepository;
import com.vaas.backend.repository.UserRepository;
import com.vaas.backend.security.ApiKeyAuthFilter;
import com.vaas.backend.service.ReputationService;
import com.vaas.backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Partner Platform Gateway (B2B)", description = "APIs used by partner platforms (Uber, Ola, Urban Company, Zomato, Swiggy) to onboard gig workers, log performance/safety feedback, and query universal trust passports.")
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
    @Operation(summary = "List pre-seeded platform API keys", description = "Public sandbox endpoint returning pre-seeded API keys for developer testing and playground simulation.")
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
    @Operation(summary = "Onboard gig worker & query cross-platform history", description = "Onboards a worker to the calling platform. If the worker is already registered in VaaS, immediately returns their cross-platform work history, aggregate rating, and safety flags. If new, generates a universal DID and records initial affiliation.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Existing worker recognized and linked to platform"),
        @ApiResponse(responseCode = "201", description = "New worker registered into VaaS and affiliated"),
        @ApiResponse(responseCode = "401", description = "Missing or invalid API key"),
        @ApiResponse(responseCode = "400", description = "Validation error in request payload")
    })
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
    @Operation(summary = "Submit performance review or safety incident", description = "Platform submits a rating (1-5★), category, review comment, and incident severity flag (NORMAL, WARNING, CRITICAL_INCIDENT). The worker's universal Trust Score is dynamically recalculated.")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Review saved and trust score updated"),
        @ApiResponse(responseCode = "401", description = "Missing or invalid API key"),
        @ApiResponse(responseCode = "404", description = "Worker not found for provided DID or phone")
    })
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
    @Operation(summary = "Query worker passport by DID", description = "Fetch complete cross-platform work history, connected platforms, aggregate rating, trust score, and review ledger by Decentralized ID.")
    @GetMapping("/worker/{did}")
    public ResponseEntity<WorkerPassportDTO> getWorkerByDid(
            @Parameter(description = "Worker Decentralized ID (e.g. did:vaas:...)") @PathVariable String did) {
        return userService.getWorkerPassportByDid(did)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Query full worker passport by Phone.
     */
    @Operation(summary = "Query worker passport by Phone number", description = "Fetch complete cross-platform work history and reputation passport by 10-digit mobile phone number.")
    @GetMapping("/worker/phone/{phone}")
    public ResponseEntity<WorkerPassportDTO> getWorkerByPhone(
            @Parameter(description = "10-digit phone number (e.g. 9811002233)") @PathVariable String phone) {
        return userService.getWorkerPassportByPhone(phone)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

