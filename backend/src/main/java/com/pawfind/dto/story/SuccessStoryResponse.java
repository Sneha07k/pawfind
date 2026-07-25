package com.pawfind.dto.story;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class SuccessStoryResponse {
    private Long id;
    private Long petId;
    private String petName;
    private String petImage;
    private String adopterName;
    private String title;
    private String description;
    private String imageUrl;
    private LocalDateTime createdAt;
}