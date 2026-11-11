package com.vaas.backend.dto;

import com.vaas.backend.model.ReviewFlag;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewSummaryDTO {
    private UUID id;
    private String platformName;
    private Integer rating;
    private String category;
    private String comment;
    private ReviewFlag flag;
    private LocalDateTime createdAt;
}

