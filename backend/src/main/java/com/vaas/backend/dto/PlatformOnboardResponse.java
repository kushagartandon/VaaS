package com.vaas.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlatformOnboardResponse {
    private boolean isNewWorker;
    private String did;
    private String name;
    private String phone;
    private String currentPlatform;
    private String workType;
    private Double averageRating;
    private Integer totalReviews;
    private Integer trustScore;
    private String safetyRiskStatus; // "CLEAR", "WATCHLIST", "FLAGGED"
    private List<PlatformAffiliationDTO> affiliations;
    private List<ReviewSummaryDTO> recentReviews;
    private String message;
}

