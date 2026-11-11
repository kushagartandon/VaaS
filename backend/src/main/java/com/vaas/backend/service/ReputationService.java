package com.vaas.backend.service;

import com.vaas.backend.dto.AddReviewRequest;
import com.vaas.backend.dto.ReviewSummaryDTO;
import com.vaas.backend.model.ReviewFlag;
import com.vaas.backend.model.User;
import com.vaas.backend.model.WorkerReview;
import com.vaas.backend.repository.UserRepository;
import com.vaas.backend.repository.WorkerReviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class ReputationService {

    private final WorkerReviewRepository workerReviewRepository;
    private final UserRepository userRepository;

    public ReputationService(WorkerReviewRepository workerReviewRepository, UserRepository userRepository) {
        this.workerReviewRepository = workerReviewRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ReviewSummaryDTO addReview(AddReviewRequest request, User user) {
        WorkerReview review = WorkerReview.builder()
                .user(user)
                .platformName(request.getPlatformName().trim())
                .rating(request.getRating())
                .category(request.getCategory().trim())
                .comment(request.getComment() != null ? request.getComment().trim() : "")
                .flag(request.getFlag() != null ? request.getFlag() : ReviewFlag.NORMAL)
                .build();

        WorkerReview savedReview = workerReviewRepository.save(review);

        // Fetch all reviews for this user to recalculate aggregate statistics
        List<WorkerReview> allReviews = workerReviewRepository.findByUserOrderByCreatedAtDesc(user);
        recalculateAndSaveUserReputation(user, allReviews);

        return mapToReviewSummary(savedReview);
    }

    public void recalculateAndSaveUserReputation(User user, List<WorkerReview> allReviews) {
        if (allReviews == null || allReviews.isEmpty()) {
            user.setTotalReviews(0);
            user.setAverageRating(5.0);
            user.setTrustScore(80);
            userRepository.save(user);
            return;
        }

        int count = allReviews.size();
        double sum = allReviews.stream().mapToInt(WorkerReview::getRating).sum();
        double avg = BigDecimal.valueOf(sum / count)
                .setScale(1, RoundingMode.HALF_UP)
                .doubleValue();

        // Count warning and critical flags
        long warningCount = allReviews.stream().filter(r -> r.getFlag() == ReviewFlag.WARNING).count();
        long criticalCount = allReviews.stream().filter(r -> r.getFlag() == ReviewFlag.CRITICAL_INCIDENT).count();

        // Calculate dynamic Trust Score (0-100)
        int baseScore = 75;
        int ratingImpact = (int) Math.round((avg - 3.0) * 8.0); // e.g. 5.0 -> +16, 2.0 -> -8
        int volumeBonus = Math.min(count, 10); // up to +10 for established review history
        int platformBonus = user.getPlatforms() != null ? Math.min(user.getPlatforms().size() * 3, 9) : 0; // multi-platform credibility

        int penalties = (int) (warningCount * 15 + criticalCount * 30);

        int trustScore = baseScore + ratingImpact + volumeBonus + platformBonus - penalties;
        trustScore = Math.max(10, Math.min(100, trustScore)); // clamp between 10 and 100

        user.setTotalReviews(count);
        user.setAverageRating(avg);
        user.setTrustScore(trustScore);

        userRepository.save(user);
    }

    public String determineSafetyRiskStatus(User user, List<WorkerReview> reviews) {
        boolean hasCritical = reviews != null && reviews.stream().anyMatch(r -> r.getFlag() == ReviewFlag.CRITICAL_INCIDENT);
        boolean hasWarning = reviews != null && reviews.stream().anyMatch(r -> r.getFlag() == ReviewFlag.WARNING);

        int score = user.getTrustScore() != null ? user.getTrustScore() : 80;

        if (hasCritical || score < 50) {
            return "FLAGGED";
        }
        if (hasWarning || score < 70) {
            return "WATCHLIST";
        }
        return "CLEAR";
    }

    public ReviewSummaryDTO mapToReviewSummary(WorkerReview review) {
        return ReviewSummaryDTO.builder()
                .id(review.getId())
                .platformName(review.getPlatformName())
                .rating(review.getRating())
                .category(review.getCategory())
                .comment(review.getComment())
                .flag(review.getFlag())
                .createdAt(review.getCreatedAt())
                .build();
    }
}

