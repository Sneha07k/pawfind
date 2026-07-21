package com.pawfind.dto.ngo;

import com.pawfind.entity.enums.NgoStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class NgoResponse {
    private Long id;
    private String organizationName;
    private String address;
    private Double latitude;
    private Double longitude;
    private String logoUrl;
    private NgoStatus status;
    private String rejectionReason;

    // included only in admin views
    private String contactName;
    private String contactEmail;
}