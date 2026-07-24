package com.pawfind.dto.application;

import com.pawfind.entity.enums.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class ApplicationResponse {
    private Long id;
    private Long petId;
    private String petName;
    private String petImage;
    private Long ngoId;
    private String ngoName;
    private Long adopterId;
    private String adopterName;
    private String adopterEmail;

    private String fullName;
    private String phoneNumber;
    private String address;
    private String occupation;
    private String houseType;
    private String previousPetExperience;
    private String existingPets;
    private String reasonForAdoption;

    private ApplicationStatus status;
    private String signatureUrl;
    private String agreementPdfUrl;
    private LocalDateTime applicationDate;
}