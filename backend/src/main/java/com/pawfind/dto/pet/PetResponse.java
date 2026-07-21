package com.pawfind.dto.pet;

import com.pawfind.entity.enums.Gender;
import com.pawfind.entity.enums.PetStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class PetResponse {
    private Long id;
    private Long ngoId;
    private String ngoName;
    private String name;
    private String species;
    private String breed;
    private Gender gender;
    private Integer age;
    private boolean vaccinated;
    private boolean sterilized;
    private String healthInfo;
    private String story;
    private Double latitude;
    private Double longitude;
    private PetStatus status;
    private List<String> images;
    private LocalDateTime createdAt;
}