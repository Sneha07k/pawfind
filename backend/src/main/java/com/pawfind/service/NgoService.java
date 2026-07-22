package com.pawfind.service;

import com.pawfind.dto.ngo.NgoProfileRequest;
import com.pawfind.dto.ngo.NgoResponse;
import com.pawfind.entity.Ngo;
import com.pawfind.entity.User;
import com.pawfind.entity.enums.NgoStatus;
import com.pawfind.entity.enums.Role;
import com.pawfind.repository.NgoRepository;
import com.pawfind.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.pawfind.dto.ngo.NearbyNgoResponse;
import com.pawfind.entity.enums.NgoStatus;
import com.pawfind.util.GeoUtils;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NgoService {

    private final NgoRepository ngoRepository;
    private final UserRepository userRepository;

    public NgoResponse createOrUpdateProfile(String email, NgoProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        if (user.getRole() != Role.NGO) {
            throw new IllegalStateException("Only NGO accounts can create an organization profile");
        }

        Ngo ngo = ngoRepository.findByUserId(user.getId()).orElse(null);

        if (ngo == null) {
            ngo = Ngo.builder()
                    .user(user)
                    .organizationName(request.getOrganizationName())
                    .address(request.getAddress())
                    .latitude(request.getLatitude())
                    .longitude(request.getLongitude())
                    .logoUrl(request.getLogoUrl())
                    .status(NgoStatus.PENDING)
                    .build();
        } else {
            // editing a profile that was rejected sends it back to PENDING for re-review
            ngo.setOrganizationName(request.getOrganizationName());
            ngo.setAddress(request.getAddress());
            ngo.setLatitude(request.getLatitude());
            ngo.setLongitude(request.getLongitude());
            ngo.setLogoUrl(request.getLogoUrl());
            if (ngo.getStatus() == NgoStatus.REJECTED) {
                ngo.setStatus(NgoStatus.PENDING);
                ngo.setRejectionReason(null);
            }
        }

        Ngo saved = ngoRepository.save(ngo);
        return toResponse(saved);
    }

    public List<NearbyNgoResponse> findNearby(double lat, double lng, double radiusKm) {
        return ngoRepository.findByStatus(NgoStatus.APPROVED).stream()
                .filter(n -> n.getLatitude() != null && n.getLongitude() != null)
                .map(n -> new NearbyNgoResponse(
                        n.getId(), n.getOrganizationName(), n.getAddress(),
                        n.getLatitude(), n.getLongitude(), n.getLogoUrl(),
                        GeoUtils.distanceKm(lat, lng, n.getLatitude(), n.getLongitude())))
                .filter(n -> n.getDistanceKm() <= radiusKm)
                .sorted(Comparator.comparingDouble(NearbyNgoResponse::getDistanceKm))
                .toList();
    }

    public NgoResponse getMyProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found"));
        Ngo ngo = ngoRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalStateException("No organization profile found yet"));
        return toResponse(ngo);
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