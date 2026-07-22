package com.pawfind.controller;

import com.pawfind.dto.question.AnswerRequest;
import com.pawfind.dto.question.QuestionRequest;
import com.pawfind.dto.question.QuestionResponse;
import com.pawfind.security.CustomUserDetailsService;
import com.pawfind.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping("/pets/{petId}/questions")
    public ResponseEntity<QuestionResponse> ask(
            @AuthenticationPrincipal CustomUserDetailsService.UserPrincipal principal,
            @PathVariable Long petId,
            @Valid @RequestBody QuestionRequest request) {
        return ResponseEntity.ok(questionService.askQuestion(principal.getUsername(), petId, request));
    }

    @GetMapping("/pets/{petId}/questions")
    public ResponseEntity<List<QuestionResponse>> list(@PathVariable Long petId) {
        return ResponseEntity.ok(questionService.getQuestionsForPet(petId));
    }

    @PutMapping("/questions/{questionId}/answer")
    public ResponseEntity<QuestionResponse> answer(
            @AuthenticationPrincipal CustomUserDetailsService.UserPrincipal principal,
            @PathVariable Long questionId,
            @Valid @RequestBody AnswerRequest request) {
        return ResponseEntity.ok(questionService.answerQuestion(principal.getUsername(), questionId, request));
    }
}