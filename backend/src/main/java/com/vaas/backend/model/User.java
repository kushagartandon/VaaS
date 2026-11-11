package com.vaas.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false, length = 15)
    private String phone;

    @Column(nullable = false, length = 4)
    private String aadhaarLast4;

    private String pan;

    // Optional primary work type and platform ID for backward compatibility
    private String workType;
    private String platformId;

    @Column(unique = true, nullable = false, length = 100)
    private String did;          // Unique Identifier for VaaS

    private String qrCodePath;   // Optional: path to generated QR image

    @Builder.Default
    @Column(nullable = false)
    private Double averageRating = 5.0;

    @Builder.Default
    @Column(nullable = false)
    private Integer totalReviews = 0;

    @Builder.Default
    @Column(nullable = false)
    private Integer trustScore = 80;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Builder.Default
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<WorkerPlatform> platforms = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<WorkerReview> reviews = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (averageRating == null) {
            averageRating = 5.0;
        }
        if (totalReviews == null) {
            totalReviews = 0;
        }
        if (trustScore == null) {
            trustScore = 80;
        }
    }
}

