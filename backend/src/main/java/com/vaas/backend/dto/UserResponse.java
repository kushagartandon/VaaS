package com.vaas.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private UUID id;
    private String name;
    private String phone;
    private String aadhaarLast4;
    private String workType;
    private String platformId;
    private String did;
    private String qrCodePath;
}

