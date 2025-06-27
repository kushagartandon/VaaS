package com.vaas.backend.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.boot.autoconfigure.security.SecurityProperties.User;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    // Custom method to fetch user by phone number
    Optional<User> findByPhone(String phone);

    // (Optional) fetch by DID
    Optional<User> findByDid(String did);
}
