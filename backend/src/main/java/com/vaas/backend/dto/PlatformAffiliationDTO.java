package com.vaas.backend.dto;

import com.vaas.backend.model.PlatformStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlatformAffiliationDTO {
    private String platformName;
    private String platformWorkerId;
    private String workType;
    private PlatformStatus status;
    private LocalDateTime onboardedAt;
}

