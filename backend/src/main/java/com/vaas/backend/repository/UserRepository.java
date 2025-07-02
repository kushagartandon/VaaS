package com.vaas.backend.repository;

import java.util.Optional;
import java.util.UUID;
import com.vaas.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    // Custom method to fetch user by phone number
    Optional<User> findByPhone(String phone);

    // fetch by DID
    Optional<User> findByDid(String did);
}
