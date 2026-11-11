package com.vaas.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkerPassportDTO {
    private UUID id;
    private String did;
    private String name;
    private String phone;
    private String aadhaarLast4;
    private Double averageRating;
    private Integer totalReviews;
    private Integer trustScore;
    private String safetyRiskStatus; // "CLEAR", "WATCHLIST", "FLAGGED"
    private LocalDateTime memberSince;
    private List<PlatformAffiliationDTO> affiliations;
    private List<ReviewSummaryDTO> reviews;
}

