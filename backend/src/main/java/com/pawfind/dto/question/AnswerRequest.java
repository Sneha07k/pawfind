package com.pawfind.dto.question;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AnswerRequest {
    @NotBlank(message = "Answer cannot be empty")
    private String answer;
}