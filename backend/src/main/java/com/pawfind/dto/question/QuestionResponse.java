package com.pawfind.dto.question;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class QuestionResponse {
    private Long id;
    private Long petId;
    private String askedByName;
    private String question;
    private String answer;
    private LocalDateTime createdAt;
    private LocalDateTime answeredAt;
}