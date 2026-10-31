package com.vaas.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false, length = 15)
    private String phone;

    @Column(nullable = false, length = 4)
    private String aadhaarLast4;

    private String pan;

    @Column(nullable = false)
    private String workType;     // e.g. Driver, Beautician, Plumber

    @Column(nullable = false)
    private String platformId;   // e.g. Uber ID, Urban Company ID

    @Column(unique = true, nullable = false, length = 100)
    private String did;          // Unique Identifier for VaaS

    private String qrCodePath;   // Optional: path to generated QR image
}

