package com.vaas.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRegistrationRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be exactly 10 digits")
    private String phone;

    @NotBlank(message = "Aadhaar last 4 digits are required")
    @Pattern(regexp = "^[0-9]{4}$", message = "Aadhaar must be exactly the last 4 digits")
    private String aadhaarLast4;

    @NotBlank(message = "Work type is required")
    private String workType;

    @NotBlank(message = "Platform ID is required")
    private String platformId;

    private String pan;
}

