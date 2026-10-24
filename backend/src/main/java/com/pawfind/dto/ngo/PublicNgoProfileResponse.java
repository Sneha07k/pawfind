package com.pawfind.dto.ngo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class PublicNgoProfileResponse {
    private Long id;
    private String organizationName;
    private String address;
    private Double latitude;
    private Double longitude;
    private String logoUrl;
    private long totalPetsListed;
}