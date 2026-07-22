package com.pawfind.controller;

import com.pawfind.dto.ngo.NgoProfileRequest;
import com.pawfind.dto.ngo.NgoResponse;
import com.pawfind.security.CustomUserDetailsService;
import com.pawfind.service.NgoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.pawfind.dto.ngo.NearbyNgoResponse;
import java.util.List;

@RestController
@RequestMapping("/api/ngo")
@RequiredArgsConstructor
public class NgoController {

    private final NgoService ngoService;

    @PostMapping("/profile")
    public ResponseEntity<NgoResponse> createOrUpdateProfile(
            @AuthenticationPrincipal CustomUserDetailsService.UserPrincipal principal,
            @Valid @RequestBody NgoProfileRequest request) {
        return ResponseEntity.ok(ngoService.createOrUpdateProfile(principal.getUsername(), request));
    }

    @GetMapping("/profile")
    public ResponseEntity<NgoResponse> getMyProfile(
            @AuthenticationPrincipal CustomUserDetailsService.UserPrincipal principal) {
        return ResponseEntity.ok(ngoService.getMyProfile(principal.getUsername()));
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<NearbyNgoResponse>> nearby(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "25") double radiusKm) {
        return ResponseEntity.ok(ngoService.findNearby(lat, lng, radiusKm));
    }
}