package com.vaas.backend.service;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.apache.commons.codec.digest.DigestUtils;

import com.vaas.backend.repository.UserRepository;
import com.vaas.backend.model.User;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerUser(User user) {
        // Aadhaar last 4 digits
        if (user.getAadhaarLast4() != null && user.getAadhaarLast4().length() >= 4) {
            user.setAadhaarLast4(user.getAadhaarLast4().substring(user.getAadhaarLast4().length() - 4));
        }

        // Generate DID (based on Aadhaar + Phone + WorkType)
        String did = "did:vaas:" + DigestUtils.sha256Hex(
                (user.getAadhaarLast4() == null ? "" : user.getAadhaarLast4()) +
                user.getPhone() +
                user.getWorkType()
        );

        user.setDid(did);

        return userRepository.save(user);
    }

    public Optional<User> getUserByPhone(String phone) {
        return userRepository.findByPhone(phone);
    }
}
