package com.pawfind.dto.application;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ApplicationRequest {
    @NotBlank
    private String fullName;
    @NotBlank
    private String phoneNumber;
    @NotBlank
    private String address;
    @NotBlank
    private String occupation;
    @NotBlank
    private String houseType;
    private String previousPetExperience;
    private String existingPets;
    @NotBlank
    private String reasonForAdoption;
}