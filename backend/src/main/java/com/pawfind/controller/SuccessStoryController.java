package com.pawfind.controller;

import com.pawfind.dto.story.SuccessStoryRequest;
import com.pawfind.dto.story.SuccessStoryResponse;
import com.pawfind.security.CustomUserDetailsService;
import com.pawfind.service.SuccessStoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SuccessStoryController {

    private final SuccessStoryService successStoryService;

    @PostMapping("/pets/{petId}/success-stories")
    public ResponseEntity<SuccessStoryResponse> create(
            @AuthenticationPrincipal CustomUserDetailsService.UserPrincipal principal,
            @PathVariable Long petId,
            @Valid @RequestBody SuccessStoryRequest request) {
        return ResponseEntity.ok(successStoryService.create(principal.getUsername(), petId, request));
    }

    @PostMapping("/success-stories/{id}/image")
    public ResponseEntity<SuccessStoryResponse> uploadImage(
            @AuthenticationPrincipal CustomUserDetailsService.UserPrincipal principal,
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(successStoryService.uploadImage(principal.getUsername(), id, file));
    }

    @GetMapping("/success-stories")
    public ResponseEntity<List<SuccessStoryResponse>> listAll() {
        return ResponseEntity.ok(successStoryService.listAll());
    }

    @GetMapping("/success-stories/featured")
    public ResponseEntity<List<SuccessStoryResponse>> featured(
            @RequestParam(defaultValue = "6") int limit) {
        return ResponseEntity.ok(successStoryService.listFeatured(limit));
    }

    @GetMapping("/success-stories/mine")
    public ResponseEntity<List<SuccessStoryResponse>> mine(
            @AuthenticationPrincipal CustomUserDetailsService.UserPrincipal principal) {
        return ResponseEntity.ok(successStoryService.getMine(principal.getUsername()));
    }
}