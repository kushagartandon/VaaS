package com.vaas.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "worker_reviews")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkerReview {

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
    private String platformName; // Platform that submitted the review

    @Column(nullable = false)
    private Integer rating; // 1 to 5

    @Column(nullable = false)
    private String category; // "Punctuality", "Safety", "Customer Experience", "Dispute", etc.

    @Column(length = 1000)
    private String comment;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReviewFlag flag; // NORMAL, WARNING, CRITICAL_INCIDENT

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (flag == null) {
            flag = ReviewFlag.NORMAL;
        }
    }
}

