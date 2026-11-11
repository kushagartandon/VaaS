package com.vaas.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "worker_platforms", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "platformName"})
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkerPlatform {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User user;

    @Column(nullable = false)
    private String platformName; // "Uber", "Ola", "Urban Company", "Zomato", etc.

    @Column(nullable = false)
    private String platformWorkerId; // "UBER-1029", "OLA-883", etc.

    @Column(nullable = false)
    private String workType; // "Driver", "Delivery", "Electrician", etc.

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PlatformStatus status; // ACTIVE, INACTIVE, SUSPENDED

    @Column(nullable = false)
    private LocalDateTime onboardedAt;

    @PrePersist
    public void prePersist() {
        if (onboardedAt == null) {
            onboardedAt = LocalDateTime.now();
        }
        if (status == null) {
            status = PlatformStatus.ACTIVE;
        }
    }
}

