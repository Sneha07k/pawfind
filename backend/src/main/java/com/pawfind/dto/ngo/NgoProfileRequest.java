package com.pawfind.dto.ngo;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class NgoProfileRequest {
    @NotBlank(message = "Organization name is required")
    private String organizationName;

    @NotBlank(message = "Address is required")
    private String address;

    private Double latitude;
    private Double longitude;
    private String logoUrl;
}