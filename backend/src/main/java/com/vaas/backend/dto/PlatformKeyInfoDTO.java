package com.vaas.backend.dto;

import com.vaas.backend.model.PlatformEnvironment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlatformKeyInfoDTO {
    private String name;
    private String apiKey;
    private PlatformEnvironment environment;
    private boolean active;
    private LocalDateTime lastUsedAt;
}

