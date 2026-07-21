package com.pawfind.controller;

import com.pawfind.dto.pet.PetRequest;
import com.pawfind.dto.pet.PetResponse;
import com.pawfind.security.CustomUserDetailsService;
import com.pawfind.service.PetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/pets")
@RequiredArgsConstructor
public class PetController {

    private final PetService petService;

    @PostMapping
    public ResponseEntity<PetResponse> createPet(
            @AuthenticationPrincipal CustomUserDetailsService.UserPrincipal principal,
            @Valid @RequestBody PetRequest request) {
        return ResponseEntity.ok(petService.createPet(principal.getUsername(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PetResponse> updatePet(
            @AuthenticationPrincipal CustomUserDetailsService.UserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody PetRequest request) {
        return ResponseEntity.ok(petService.updatePet(principal.getUsername(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePet(
            @AuthenticationPrincipal CustomUserDetailsService.UserPrincipal principal,
            @PathVariable Long id) {
        petService.deletePet(principal.getUsername(), id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<PetResponse>> listAvailable() {
        return ResponseEntity.ok(petService.listAvailablePets());
    }

    @GetMapping("/mine")
    public ResponseEntity<List<PetResponse>> listMine(
            @AuthenticationPrincipal CustomUserDetailsService.UserPrincipal principal) {
        return ResponseEntity.ok(petService.listMyPets(principal.getUsername()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PetResponse> getPet(@PathVariable Long id) {
        return ResponseEntity.ok(petService.getPet(id));
    }

    @PostMapping("/{id}/images")
    public ResponseEntity<PetResponse> uploadImage(
            @AuthenticationPrincipal CustomUserDetailsService.UserPrincipal principal,
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(petService.uploadImage(principal.getUsername(), id, file));
    }

    @DeleteMapping("/{id}/images/{imageId}")
    public ResponseEntity<Void> deleteImage(
            @AuthenticationPrincipal CustomUserDetailsService.UserPrincipal principal,
            @PathVariable Long id,
            @PathVariable Long imageId) {
        petService.deleteImage(principal.getUsername(), id, imageId);
        return ResponseEntity.noContent().build();
    }
}