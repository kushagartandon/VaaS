package com.vaas.backend.repository;

import com.vaas.backend.model.User;
import com.vaas.backend.model.WorkerPlatform;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WorkerPlatformRepository extends JpaRepository<WorkerPlatform, UUID> {
    Optional<WorkerPlatform> findByUserAndPlatformNameIgnoreCase(User user, String platformName);
    List<WorkerPlatform> findByUserOrderByOnboardedAtDesc(User user);
    List<WorkerPlatform> findByUserIdOrderByOnboardedAtDesc(UUID userId);
}

