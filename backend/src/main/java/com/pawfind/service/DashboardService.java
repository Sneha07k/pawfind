package com.pawfind.service;

import com.pawfind.dto.dashboard.NgoDashboardStats;
import com.pawfind.entity.enums.ApplicationStatus;
import com.pawfind.repository.ApplicationRepository;
import com.pawfind.repository.NgoRepository;
import com.pawfind.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ApplicationRepository applicationRepository;
    private final NgoRepository ngoRepository;
    private final UserRepository userRepository;
    private final PetService petService;

    public NgoDashboardStats getNgoStats(String email) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found"));
        var ngo = ngoRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalStateException("No organization profile found"));

        var applications = applicationRepository.findByPetNgoId(ngo.getId());

        long pending = applications.stream().filter(a -> a.getStatus() == ApplicationStatus.PENDING).count();
        long approved = applications.stream()
                .filter(a -> a.getStatus() == ApplicationStatus.APPROVED
                        || a.getStatus() == ApplicationStatus.AGREEMENT_SIGNED)
                .count();
        long completed = applications.stream().filter(a -> a.getStatus() == ApplicationStatus.COMPLETED).count();

        return NgoDashboardStats.builder()
                .totalPetsListed(petService.countPetsForNgo(email))
                .pendingApplications(pending)
                .approvedApplications(approved)
                .completedAdoptions(completed)
                .build();
    }
}