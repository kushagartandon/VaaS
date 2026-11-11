package com.vaas.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "partner_platforms")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PartnerPlatform {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name; // e.g. "Uber", "Ola", "Urban Company", "Zomato"

    @Column(nullable = false, unique = true, length = 100)
    private String apiKey; // e.g. "vaas_live_uber_883910"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PlatformEnvironment environment; // TEST, LIVE

    @Builder.Default
    @Column(nullable = false)
    private boolean active = true;

    private LocalDateTime createdAt;
    private LocalDateTime lastUsedAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (environment == null) {
            environment = PlatformEnvironment.LIVE;
        }
    }
}

