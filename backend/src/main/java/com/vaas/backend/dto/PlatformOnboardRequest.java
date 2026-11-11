package com.vaas.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlatformOnboardRequest {

    @NotBlank(message = "Platform name is required (e.g. Uber, Ola)")
    private String platformName;

    @NotBlank(message = "Platform worker ID is required (e.g. UBER-1029)")
    private String platformWorkerId;

    @NotBlank(message = "Worker name is required")
    private String name;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be exactly 10 digits")
    private String phone;

    @NotBlank(message = "Aadhaar last 4 digits are required")
    @Pattern(regexp = "^[0-9]{4}$", message = "Aadhaar must be exactly the last 4 digits")
    private String aadhaarLast4;

    @NotBlank(message = "Work type is required (e.g. Driver, Delivery, Electrician)")
    private String workType;

    private String pan;
}

