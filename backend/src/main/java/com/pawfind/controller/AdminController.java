package com.pawfind.controller;

import com.pawfind.dto.ngo.NgoResponse;
import com.pawfind.dto.ngo.RejectNgoRequest;
import com.pawfind.entity.enums.NgoStatus;
import com.pawfind.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.pawfind.dto.admin.UserSummaryResponse;

import java.util.List;

@RestController
@RequestMapping("/api/admin/ngos")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping
    public ResponseEntity<List<NgoResponse>> listByStatus(
            @RequestParam(defaultValue = "PENDING") NgoStatus status) {
        return ResponseEntity.ok(adminService.listNgosByStatus(status));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<NgoResponse> approve(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.approveNgo(id));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<NgoResponse> reject(@PathVariable Long id, @RequestBody RejectNgoRequest request) {
        return ResponseEntity.ok(adminService.rejectNgo(id, request.getReason()));
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserSummaryResponse>> listUsers() {
        return ResponseEntity.ok(adminService.listAllUsers());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/pets/{id}")
    public ResponseEntity<Void> removePet(@PathVariable Long id) {
        adminService.removePetListing(id);
        return ResponseEntity.noContent().build();
    }
}