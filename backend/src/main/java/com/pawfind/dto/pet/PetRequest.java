package com.pawfind.dto.pet;

import com.pawfind.entity.enums.Gender;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PetRequest {
    @NotBlank
    private String name;

    @NotBlank
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
}