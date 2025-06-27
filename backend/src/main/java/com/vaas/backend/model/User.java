package com.vaas.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;
    private String phone;

    // Optional but used for verification
    private String aadhaarLast4;
    private String pan;

    private String workType;     // e.g., Driver, Beautician, Plumber
    private String platformId;   // e.g., Uber ID, Urban Company ID

    private String did;          // Decentralized Identity
    private String qrCodePath;   // Optional: path to generated QR image
}

