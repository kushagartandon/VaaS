package com.vaas.backend.dto;

import com.vaas.backend.model.ReviewFlag;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddReviewRequest {

    // Optional in JSON body; automatically resolved from authenticated API Key
    private String platformName;

    private String did;
    private String phone;

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating cannot exceed 5")
    private Integer rating;

    @NotBlank(message = "Category is required (e.g. Punctuality, Safety, Customer Service)")
    private String category;

    private String comment;

    @Builder.Default
    private ReviewFlag flag = ReviewFlag.NORMAL;
}

