package com.pawfind.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class NgoDashboardStats {
    private long totalPetsListed;
    private long pendingApplications;
    private long approvedApplications;
    private long completedAdoptions;
}