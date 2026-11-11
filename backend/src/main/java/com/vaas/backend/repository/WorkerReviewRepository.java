package com.vaas.backend.repository;

import com.vaas.backend.model.User;
import com.vaas.backend.model.WorkerReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WorkerReviewRepository extends JpaRepository<WorkerReview, UUID> {
    List<WorkerReview> findByUserOrderByCreatedAtDesc(User user);
    List<WorkerReview> findByUserIdOrderByCreatedAtDesc(UUID userId);
}

