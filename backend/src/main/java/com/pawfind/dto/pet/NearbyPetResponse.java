package com.pawfind.dto.pet;

import com.pawfind.entity.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class NearbyPetResponse {
    private Long id;
    private String name;
    private String species;
    private String breed;
    private Gender gender;
    private Double latitude;
    private Double longitude;
    private List<String> images;
    private double distanceKm;
}