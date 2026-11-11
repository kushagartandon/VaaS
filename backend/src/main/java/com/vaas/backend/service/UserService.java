package com.vaas.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.vaas.backend.dto.*;
import com.vaas.backend.model.PlatformStatus;
import com.vaas.backend.model.User;
import com.vaas.backend.model.WorkerPlatform;
import com.vaas.backend.model.WorkerReview;
import com.vaas.backend.repository.UserRepository;
import com.vaas.backend.repository.WorkerPlatformRepository;
import com.vaas.backend.repository.WorkerReviewRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final WorkerPlatformRepository workerPlatformRepository;
    private final WorkerReviewRepository workerReviewRepository;
    private final ReputationService reputationService;

    public UserService(
            UserRepository userRepository,
            WorkerPlatformRepository workerPlatformRepository,
            WorkerReviewRepository workerReviewRepository,
            ReputationService reputationService) {
        this.userRepository = userRepository;
        this.workerPlatformRepository = workerPlatformRepository;
        this.workerReviewRepository = workerReviewRepository;
        this.reputationService = reputationService;
    }

    /**
     * Central B2B Onboarding API:
     * - If worker is already registered: links new platform affiliation and returns cross-platform history/score.
     * - If worker is new: generates universal DID, creates profile, and links first platform affiliation.
     */
    @Transactional
    public PlatformOnboardResponse onboardWorkerFromPlatform(PlatformOnboardRequest request) {
        String phone = request.getPhone().trim();
        String platformName = request.getPlatformName().trim();
        String platformWorkerId = request.getPlatformWorkerId().trim();
        String workType = request.getWorkType().trim();

        // Sanitize Aadhaar to last 4 digits
        String aadhaarInput = request.getAadhaarLast4().trim();
        String aadhaarLast4 = aadhaarInput.length() > 4
                ? aadhaarInput.substring(aadhaarInput.length() - 4)
                : aadhaarInput;

        Optional<User> existingUserOpt = userRepository.findByPhone(phone);

        if (existingUserOpt.isPresent()) {
            User user = existingUserOpt.get();

            // Link or update platform affiliation
            Optional<WorkerPlatform> existingAffiliationOpt =
                    workerPlatformRepository.findByUserAndPlatformNameIgnoreCase(user, platformName);

            if (existingAffiliationOpt.isPresent()) {
                WorkerPlatform affiliation = existingAffiliationOpt.get();
                affiliation.setPlatformWorkerId(platformWorkerId);
                affiliation.setWorkType(workType);
                affiliation.setStatus(PlatformStatus.ACTIVE);
                workerPlatformRepository.save(affiliation);
            } else {
                WorkerPlatform newAffiliation = WorkerPlatform.builder()
                        .user(user)
                        .platformName(platformName)
                        .platformWorkerId(platformWorkerId)
                        .workType(workType)
                        .status(PlatformStatus.ACTIVE)
                        .onboardedAt(LocalDateTime.now())
                        .build();
                workerPlatformRepository.save(newAffiliation);
            }

            List<WorkerPlatform> affiliations = workerPlatformRepository.findByUserOrderByOnboardedAtDesc(user);
            List<WorkerReview> reviews = workerReviewRepository.findByUserOrderByCreatedAtDesc(user);
            String safetyStatus = reputationService.determineSafetyRiskStatus(user, reviews);

            return PlatformOnboardResponse.builder()
                    .isNewWorker(false)
                    .did(user.getDid())
                    .name(user.getName())
                    .phone(user.getPhone())
                    .currentPlatform(platformName)
                    .workType(workType)
                    .averageRating(user.getAverageRating())
                    .totalReviews(user.getTotalReviews())
                    .trustScore(user.getTrustScore())
                    .safetyRiskStatus(safetyStatus)
                    .affiliations(affiliations.stream().map(this::mapToAffiliationDTO).collect(Collectors.toList()))
                    .recentReviews(reviews.stream().map(reputationService::mapToReviewSummary).collect(Collectors.toList()))
                    .message("Worker recognized in VaaS network! Affiliation linked to " + platformName + ".")
                    .build();
        } else {
            // Universal Person DID: sha256(aadhaarLast4 + phone)
            String did = "did:vaas:" + DigestUtils.sha256Hex(aadhaarLast4 + phone);

            User newUser = User.builder()
                    .name(request.getName().trim())
                    .phone(phone)
                    .aadhaarLast4(aadhaarLast4)
                    .pan(request.getPan() != null ? request.getPan().trim() : null)
                    .workType(workType)
                    .platformId(platformWorkerId)
                    .did(did)
                    .averageRating(5.0)
                    .totalReviews(0)
                    .trustScore(80)
                    .build();

            User savedUser = userRepository.save(newUser);

            WorkerPlatform initialAffiliation = WorkerPlatform.builder()
                    .user(savedUser)
                    .platformName(platformName)
                    .platformWorkerId(platformWorkerId)
                    .workType(workType)
                    .status(PlatformStatus.ACTIVE)
                    .onboardedAt(LocalDateTime.now())
                    .build();

            WorkerPlatform savedAffiliation = workerPlatformRepository.save(initialAffiliation);

            return PlatformOnboardResponse.builder()
                    .isNewWorker(true)
                    .did(savedUser.getDid())
                    .name(savedUser.getName())
                    .phone(savedUser.getPhone())
                    .currentPlatform(platformName)
                    .workType(workType)
                    .averageRating(5.0)
                    .totalReviews(0)
                    .trustScore(80)
                    .safetyRiskStatus("CLEAR")
                    .affiliations(List.of(mapToAffiliationDTO(savedAffiliation)))
                    .recentReviews(List.of())
                    .message("New worker registered into VaaS network and affiliated with " + platformName + ".")
                    .build();
        }
    }

    /**
     * Legacy direct registration (for self-onboarding portal)
     */
    @Transactional
    public UserResponse registerUser(UserRegistrationRequest request) {
        String phone = request.getPhone().trim();

        if (userRepository.findByPhone(phone).isPresent()) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "A worker with phone number " + phone + " is already registered."
            );
        }

        String aadhaarInput = request.getAadhaarLast4().trim();
        String aadhaarLast4 = aadhaarInput.length() > 4
                ? aadhaarInput.substring(aadhaarInput.length() - 4)
                : aadhaarInput;

        String did = "did:vaas:" + DigestUtils.sha256Hex(aadhaarLast4 + phone);

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
                .averageRating(5.0)
                .totalReviews(0)
                .trustScore(80)
                .build();

        User savedUser = userRepository.save(user);

        // Also create initial platform affiliation
        WorkerPlatform affiliation = WorkerPlatform.builder()
                .user(savedUser)
                .platformName("Self-Registered")
                .platformWorkerId(request.getPlatformId().trim())
                .workType(request.getWorkType().trim())
                .status(PlatformStatus.ACTIVE)
                .onboardedAt(LocalDateTime.now())
                .build();
        workerPlatformRepository.save(affiliation);

        return mapToResponse(savedUser);
    }

    public Optional<WorkerPassportDTO> getWorkerPassportByDid(String did) {
        return userRepository.findByDid(did).map(this::buildWorkerPassport);
    }

    public Optional<WorkerPassportDTO> getWorkerPassportByPhone(String phone) {
        return userRepository.findByPhone(phone).map(this::buildWorkerPassport);
    }

    public WorkerPassportDTO buildWorkerPassport(User user) {
        List<WorkerPlatform> affiliations = workerPlatformRepository.findByUserOrderByOnboardedAtDesc(user);
        List<WorkerReview> reviews = workerReviewRepository.findByUserOrderByCreatedAtDesc(user);
        String safetyStatus = reputationService.determineSafetyRiskStatus(user, reviews);

        return WorkerPassportDTO.builder()
                .id(user.getId())
                .did(user.getDid())
                .name(user.getName())
                .phone(user.getPhone())
                .aadhaarLast4(user.getAadhaarLast4())
                .averageRating(user.getAverageRating())
                .totalReviews(user.getTotalReviews())
                .trustScore(user.getTrustScore())
                .safetyRiskStatus(safetyStatus)
                .memberSince(user.getCreatedAt())
                .affiliations(affiliations.stream().map(this::mapToAffiliationDTO).collect(Collectors.toList()))
                .reviews(reviews.stream().map(reputationService::mapToReviewSummary).collect(Collectors.toList()))
                .build();
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

    public PlatformAffiliationDTO mapToAffiliationDTO(WorkerPlatform platform) {
        return PlatformAffiliationDTO.builder()
                .platformName(platform.getPlatformName())
                .platformWorkerId(platform.getPlatformWorkerId())
                .workType(platform.getWorkType())
                .status(platform.getStatus())
                .onboardedAt(platform.getOnboardedAt())
                .build();
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
