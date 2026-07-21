package com.pawfind.entity;

import com.pawfind.entity.enums.ApplicationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    @ManyToOne
    @JoinColumn(name = "adopter_id", nullable = false)
    private User adopter;

    // --- application form fields ---
    private String fullName;
    private String phoneNumber;
    private String address;
    private String occupation;
    private String houseType;

    @Column(columnDefinition = "TEXT")
    private String previousPetExperience;

    @Column(columnDefinition = "TEXT")
    private String existingPets;

    @Column(columnDefinition = "TEXT")
    private String reasonForAdoption;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.PENDING;

    // signature stored as image URL / base64 reference
    private String signatureUrl;

    private String agreementPdfUrl;

    @Column(nullable = false, updatable = false)
    private LocalDateTime applicationDate;

    @PrePersist
    protected void onCreate() {
        this.applicationDate = LocalDateTime.now();
    }
}
