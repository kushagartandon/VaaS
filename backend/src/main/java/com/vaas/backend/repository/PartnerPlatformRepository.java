package com.vaas.backend.repository;

import com.vaas.backend.model.PartnerPlatform;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PartnerPlatformRepository extends JpaRepository<PartnerPlatform, UUID> {
    Optional<PartnerPlatform> findByApiKeyAndActiveTrue(String apiKey);
    Optional<PartnerPlatform> findByNameIgnoreCase(String name);
}

