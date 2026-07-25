package com.pawfind.service;

import com.pawfind.dto.certificate.CertificateResponse;
import com.pawfind.entity.Application;
import com.pawfind.entity.Certificate;
import com.pawfind.entity.User;
import com.pawfind.entity.enums.ApplicationStatus;
import com.pawfind.entity.enums.PetStatus;
import com.pawfind.repository.ApplicationRepository;
import com.pawfind.repository.CertificateRepository;
import com.pawfind.repository.NgoRepository;
import com.pawfind.repository.PetRepository;
import com.pawfind.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Year;

@Service
@RequiredArgsConstructor
public class CertificateService {

    private final ApplicationRepository applicationRepository;
    private final CertificateRepository certificateRepository;
    private final PetRepository petRepository;
    private final UserRepository userRepository;
    private final NgoRepository ngoRepository;
    private final CloudinaryService cloudinaryService;
    private final CertificatePdfService certificatePdfService;

    private static final SecureRandom RANDOM = new SecureRandom();

    public CertificateResponse completeAdoption(String email, Long applicationId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found"));
        var ngo = ngoRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalStateException("No organization profile found"));

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalStateException("Application not found"));

        if (!application.getPet().getNgo().getId().equals(ngo.getId())) {
            throw new IllegalStateException("You do not have permission to complete this adoption");
        }
        if (application.getStatus() != ApplicationStatus.AGREEMENT_SIGNED) {
            throw new IllegalStateException("The adopter must sign the agreement before the adoption can be completed");
        }
        if (certificateRepository.findByApplicationId(applicationId).isPresent()) {
            throw new IllegalStateException("A certificate has already been issued for this application");
        }

        String certificateNumber = generateCertificateNumber();
        byte[] pdfBytes = certificatePdfService.generateCertificatePdf(application, certificateNumber);
        String pdfUrl = cloudinaryService.uploadPdf(pdfBytes, "pawfind/certificates", "certificate-" + applicationId);

        Certificate certificate = Certificate.builder()
                .application(application)
                .certificateNumber(certificateNumber)
                .pdfUrl(pdfUrl)
                .build();
        certificateRepository.save(certificate);

        application.setStatus(ApplicationStatus.COMPLETED);
        applicationRepository.save(application);

        var pet = application.getPet();
        pet.setStatus(PetStatus.ADOPTED);
        petRepository.save(pet);

        return toResponse(certificate);
    }

    public CertificateResponse getForApplication(String email, Long applicationId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found"));
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalStateException("Application not found"));

        boolean isAdopterOwner = application.getAdopter().getId().equals(user.getId());
        boolean isNgoOwner = ngoRepository.findByUserId(user.getId())
                .map(ngo -> ngo.getId().equals(application.getPet().getNgo().getId()))
                .orElse(false);
        if (!isAdopterOwner && !isNgoOwner) {
            throw new IllegalStateException("You do not have permission to view this certificate");
        }

        Certificate certificate = certificateRepository.findByApplicationId(applicationId)
                .orElseThrow(
                        () -> new IllegalStateException("No certificate has been issued for this application yet"));

        return toResponse(certificate);
    }

    private String generateCertificateNumber() {
        return "PF-" + Year.now().getValue() + "-" + String.format("%06d", RANDOM.nextInt(1_000_000));
    }

    private CertificateResponse toResponse(Certificate c) {
        return CertificateResponse.builder()
                .id(c.getId())
                .applicationId(c.getApplication().getId())
                .certificateNumber(c.getCertificateNumber())
                .pdfUrl(c.getPdfUrl())
                .adopterName(c.getApplication().getFullName())
                .petName(c.getApplication().getPet().getName())
                .ngoName(c.getApplication().getPet().getNgo().getOrganizationName())
                .issuedAt(c.getIssuedAt())
                .build();
    }
}