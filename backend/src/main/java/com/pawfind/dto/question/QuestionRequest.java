package com.pawfind.dto.question;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class QuestionRequest {
    @NotBlank(message = "Question cannot be empty")
    private String question;
}