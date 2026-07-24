package com.pawfind.controller;

import com.pawfind.dto.favorite.FavoriteToggleResponse;
import com.pawfind.dto.pet.PetResponse;
import com.pawfind.security.CustomUserDetailsService;
import com.pawfind.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping("/{petId}/toggle")
    public ResponseEntity<FavoriteToggleResponse> toggle(
            @AuthenticationPrincipal CustomUserDetailsService.UserPrincipal principal,
            @PathVariable Long petId) {
        return ResponseEntity.ok(favoriteService.toggle(principal.getUsername(), petId));
    }

    @GetMapping
    public ResponseEntity<List<PetResponse>> myFavorites(
            @AuthenticationPrincipal CustomUserDetailsService.UserPrincipal principal) {
        return ResponseEntity.ok(favoriteService.getMyFavorites(principal.getUsername()));
    }

    @GetMapping("/{petId}/status")
    public ResponseEntity<FavoriteToggleResponse> status(
            @AuthenticationPrincipal CustomUserDetailsService.UserPrincipal principal,
            @PathVariable Long petId) {
        return ResponseEntity
                .ok(new FavoriteToggleResponse(favoriteService.isFavorited(principal.getUsername(), petId)));
    }
}