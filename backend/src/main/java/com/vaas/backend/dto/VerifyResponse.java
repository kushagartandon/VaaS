package com.vaas.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VerifyResponse {
    private boolean verified;
    private String did;
    private String name;
    private String workType;
    private String platformId;
    private String message;
}

