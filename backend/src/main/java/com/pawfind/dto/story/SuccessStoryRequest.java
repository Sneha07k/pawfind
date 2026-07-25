package com.pawfind.dto.story;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SuccessStoryRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    private String imageUrl; // set separately via the image upload endpoint, optional at creation
}