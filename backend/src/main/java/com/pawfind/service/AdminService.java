package com.pawfind.service;

import com.pawfind.dto.ngo.NgoResponse;
import com.pawfind.entity.Ngo;
import com.pawfind.entity.enums.NgoStatus;
import com.pawfind.repository.NgoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final NgoRepository ngoRepository;

    public List<NgoResponse> listNgosByStatus(NgoStatus status) {
        return ngoRepository.findByStatus(status).stream().map(this::toResponse).toList();
    }

    public NgoResponse approveNgo(Long ngoId) {
        Ngo ngo = getNgo(ngoId);
        ngo.setStatus(NgoStatus.APPROVED);
        ngo.setRejectionReason(null);
        return toResponse(ngoRepository.save(ngo));
    }

    public NgoResponse rejectNgo(Long ngoId, String reason) {
        Ngo ngo = getNgo(ngoId);
        ngo.setStatus(NgoStatus.REJECTED);
        ngo.setRejectionReason(reason != null && !reason.isBlank() ? reason : "Did not meet verification requirements");
        return toResponse(ngoRepository.save(ngo));
    }

    private Ngo getNgo(Long id) {
        return ngoRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("NGO not found"));
    }

    private NgoResponse toResponse(Ngo ngo) {
        return NgoResponse.builder()
                .id(ngo.getId())
                .organizationName(ngo.getOrganizationName())
                .address(ngo.getAddress())
                .latitude(ngo.getLatitude())
                .longitude(ngo.getLongitude())
                .logoUrl(ngo.getLogoUrl())
                .status(ngo.getStatus())
                .rejectionReason(ngo.getRejectionReason())
                .contactName(ngo.getUser().getName())
                .contactEmail(ngo.getUser().getEmail())
                .build();
    }
}