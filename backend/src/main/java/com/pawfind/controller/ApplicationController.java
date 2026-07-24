package com.pawfind.controller;

import com.pawfind.dto.application.ApplicationRequest;
import com.pawfind.dto.application.ApplicationResponse;
import com.pawfind.dto.application.RejectApplicationRequest;
import com.pawfind.security.CustomUserDetailsService;
import com.pawfind.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.pawfind.dto.application.SignatureRequest;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping("/pets/{petId}/applications")
    public ResponseEntity<ApplicationResponse> submit(
            @AuthenticationPrincipal CustomUserDetailsService.UserPrincipal principal,
            @PathVariable Long petId,
            @Valid @RequestBody ApplicationRequest request) {
        return ResponseEntity.ok(applicationService.submit(principal.getUsername(), petId, request));
    }

    @GetMapping("/applications/mine")
    public ResponseEntity<List<ApplicationResponse>> myApplications(
            @AuthenticationPrincipal CustomUserDetailsService.UserPrincipal principal) {
        return ResponseEntity.ok(applicationService.getMyApplications(principal.getUsername()));
    }

    @GetMapping("/applications/{id}")
    public ResponseEntity<ApplicationResponse> getById(
            @AuthenticationPrincipal CustomUserDetailsService.UserPrincipal principal,
            @PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getById(principal.getUsername(), id));
    }

    @GetMapping("/ngo/applications")
    public ResponseEntity<List<ApplicationResponse>> forMyNgo(
            @AuthenticationPrincipal CustomUserDetailsService.UserPrincipal principal) {
        return ResponseEntity.ok(applicationService.getApplicationsForMyNgo(principal.getUsername()));
    }

    @PutMapping("/applications/{id}/approve")
    public ResponseEntity<ApplicationResponse> approve(
            @AuthenticationPrincipal CustomUserDetailsService.UserPrincipal principal,
            @PathVariable Long id) {
        return ResponseEntity.ok(applicationService.approve(principal.getUsername(), id));
    }

    @PutMapping("/applications/{id}/reject")
    public ResponseEntity<ApplicationResponse> reject(
            @AuthenticationPrincipal CustomUserDetailsService.UserPrincipal principal,
            @PathVariable Long id,
            @RequestBody RejectApplicationRequest request) {
        return ResponseEntity.ok(applicationService.reject(principal.getUsername(), id, request.getReason()));
    }

    @PostMapping("/applications/{id}/sign")
    public ResponseEntity<ApplicationResponse> sign(
            @AuthenticationPrincipal CustomUserDetailsService.UserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody SignatureRequest request) {
        return ResponseEntity
                .ok(applicationService.signAgreement(principal.getUsername(), id, request.getSignatureDataUrl()));
    }
}