package com.pawfind.service;

import com.pawfind.dto.application.ApplicationRequest;
import com.pawfind.dto.application.ApplicationResponse;
import com.pawfind.entity.Application;
import com.pawfind.entity.Pet;
import com.pawfind.entity.User;
import com.pawfind.entity.enums.ApplicationStatus;
import com.pawfind.entity.enums.PetStatus;
import com.pawfind.repository.ApplicationRepository;
import com.pawfind.repository.NgoRepository;
import com.pawfind.repository.PetRepository;
import com.pawfind.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final PetRepository petRepository;
    private final UserRepository userRepository;
    private final NgoRepository ngoRepository;

    public ApplicationResponse submit(String email, Long petId, ApplicationRequest request) {
        User adopter = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found"));
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new IllegalStateException("Pet not found"));

        if (pet.getStatus() != PetStatus.AVAILABLE) {
            throw new IllegalStateException("This pet is no longer available for adoption");
        }

        boolean alreadyApplied = applicationRepository.findByAdopterId(adopter.getId()).stream()
                .anyMatch(a -> a.getPet().getId().equals(petId)
                        && a.getStatus() != ApplicationStatus.REJECTED);
        if (alreadyApplied) {
            throw new IllegalStateException("You already have an active application for this pet");
        }

        Application application = Application.builder()
                .pet(pet)
                .adopter(adopter)
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .occupation(request.getOccupation())
                .houseType(request.getHouseType())
                .previousPetExperience(request.getPreviousPetExperience())
                .existingPets(request.getExistingPets())
                .reasonForAdoption(request.getReasonForAdoption())
                .status(ApplicationStatus.PENDING)
                .build();

        // Mark the pet as pending so other adopters see it's under review, not still
        // open
        pet.setStatus(PetStatus.PENDING_ADOPTION);
        petRepository.save(pet);

        return toResponse(applicationRepository.save(application));
    }

    public List<ApplicationResponse> getMyApplications(String email) {
        User adopter = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found"));
        return applicationRepository.findByAdopterId(adopter.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ApplicationResponse> getApplicationsForMyNgo(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found"));
        var ngo = ngoRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalStateException("No organization profile found"));
        return applicationRepository.findByPetNgoId(ngo.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    public ApplicationResponse approve(String email, Long applicationId) {
        Application application = getOwnedApplication(email, applicationId);

        if (application.getStatus() != ApplicationStatus.PENDING) {
            throw new IllegalStateException("Only pending applications can be approved");
        }

        application.setStatus(ApplicationStatus.APPROVED);
        applicationRepository.save(application);

        // Auto-reject other pending applications for the same pet, since it's now
        // spoken for
        applicationRepository.findByPetNgoId(application.getPet().getNgo().getId()).stream()
                .filter(a -> !a.getId().equals(application.getId()))
                .filter(a -> a.getPet().getId().equals(application.getPet().getId()))
                .filter(a -> a.getStatus() == ApplicationStatus.PENDING)
                .forEach(a -> {
                    a.setStatus(ApplicationStatus.REJECTED);
                    a.setRejectionReason("This pet was adopted by another applicant");
                    applicationRepository.save(a);
                });

        return toResponse(application);
    }

    public ApplicationResponse reject(String email, Long applicationId, String reason) {
        Application application = getOwnedApplication(email, applicationId);

        if (application.getStatus() != ApplicationStatus.PENDING) {
            throw new IllegalStateException("Only pending applications can be rejected");
        }

        application.setStatus(ApplicationStatus.REJECTED);
        application.setRejectionReason(reason != null && !reason.isBlank() ? reason : "Application was not approved");
        applicationRepository.save(application);

        // Pet goes back to AVAILABLE only if no other pending/approved application
        // exists for it
        boolean stillActive = applicationRepository.findByPetNgoId(application.getPet().getNgo().getId()).stream()
                .filter(a -> a.getPet().getId().equals(application.getPet().getId()))
                .anyMatch(
                        a -> a.getStatus() == ApplicationStatus.PENDING || a.getStatus() == ApplicationStatus.APPROVED);

        if (!stillActive) {
            Pet pet = application.getPet();
            pet.setStatus(PetStatus.AVAILABLE);
            petRepository.save(pet);
        }

        return toResponse(application);
    }

    public ApplicationResponse getById(String email, Long applicationId) {
        // used by both adopter (own application) and NGO (own pet's application) —
        // Phase 11 needs this
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalStateException("Application not found"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        boolean isAdopterOwner = application.getAdopter().getId().equals(user.getId());
        boolean isNgoOwner = ngoRepository.findByUserId(user.getId())
                .map(ngo -> ngo.getId().equals(application.getPet().getNgo().getId()))
                .orElse(false);

        if (!isAdopterOwner && !isNgoOwner) {
            throw new IllegalStateException("You do not have permission to view this application");
        }

        return toResponse(application);
    }

    private Application getOwnedApplication(String email, Long applicationId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found"));
        var ngo = ngoRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalStateException("No organization profile found"));

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalStateException("Application not found"));

        if (!application.getPet().getNgo().getId().equals(ngo.getId())) {
            throw new IllegalStateException("You do not have permission to review this application");
        }
        return application;
    }

    private ApplicationResponse toResponse(Application a) {
        return ApplicationResponse.builder()
                .id(a.getId())
                .petId(a.getPet().getId())
                .petName(a.getPet().getName())
                .petImage(a.getPet().getImages().isEmpty() ? null : a.getPet().getImages().get(0).getImageUrl())
                .ngoId(a.getPet().getNgo().getId())
                .ngoName(a.getPet().getNgo().getOrganizationName())
                .adopterId(a.getAdopter().getId())
                .adopterName(a.getAdopter().getName())
                .adopterEmail(a.getAdopter().getEmail())
                .fullName(a.getFullName())
                .phoneNumber(a.getPhoneNumber())
                .address(a.getAddress())
                .occupation(a.getOccupation())
                .houseType(a.getHouseType())
                .previousPetExperience(a.getPreviousPetExperience())
                .existingPets(a.getExistingPets())
                .reasonForAdoption(a.getReasonForAdoption())
                .status(a.getStatus())
                .signatureUrl(a.getSignatureUrl())
                .agreementPdfUrl(a.getAgreementPdfUrl())
                .applicationDate(a.getApplicationDate())
                .build();
    }
}