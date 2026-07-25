package com.pawfind.controller;

import com.pawfind.dto.certificate.CertificateResponse;
import com.pawfind.security.CustomUserDetailsService;
import com.pawfind.service.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class CertificateController {

    private final CertificateService certificateService;

    @PutMapping("/{id}/complete")
    public ResponseEntity<CertificateResponse> completeAdoption(
            @AuthenticationPrincipal CustomUserDetailsService.UserPrincipal principal,
            @PathVariable Long id) {
        return ResponseEntity.ok(certificateService.completeAdoption(principal.getUsername(), id));
    }

    @GetMapping("/{id}/certificate")
    public ResponseEntity<CertificateResponse> getCertificate(
            @AuthenticationPrincipal CustomUserDetailsService.UserPrincipal principal,
            @PathVariable Long id) {
        return ResponseEntity.ok(certificateService.getForApplication(principal.getUsername(), id));
    }
}