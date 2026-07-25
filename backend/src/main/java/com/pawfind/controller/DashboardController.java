package com.pawfind.controller;

import com.pawfind.dto.dashboard.NgoDashboardStats;
import com.pawfind.security.CustomUserDetailsService;
import com.pawfind.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/ngo")
    public ResponseEntity<NgoDashboardStats> ngoStats(
            @AuthenticationPrincipal CustomUserDetailsService.UserPrincipal principal) {
        return ResponseEntity.ok(dashboardService.getNgoStats(principal.getUsername()));
    }
}