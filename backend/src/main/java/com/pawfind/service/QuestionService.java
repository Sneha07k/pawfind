package com.pawfind.service;

import com.pawfind.dto.question.AnswerRequest;
import com.pawfind.dto.question.QuestionRequest;
import com.pawfind.dto.question.QuestionResponse;
import com.pawfind.entity.Pet;
import com.pawfind.entity.Question;
import com.pawfind.entity.User;
import com.pawfind.repository.NgoRepository;
import com.pawfind.repository.PetRepository;
import com.pawfind.repository.QuestionRepository;
import com.pawfind.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final PetRepository petRepository;
    private final UserRepository userRepository;
    private final NgoRepository ngoRepository;

    public QuestionResponse askQuestion(String email, Long petId, QuestionRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found"));
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new IllegalStateException("Pet not found"));

        Question question = Question.builder()
                .pet(pet)
                .user(user)
                .question(request.getQuestion())
                .build();

        return toResponse(questionRepository.save(question));
    }

    public QuestionResponse answerQuestion(String email, Long questionId, AnswerRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found"));
        var ngo = ngoRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalStateException("No organization profile found"));

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new IllegalStateException("Question not found"));

        if (!question.getPet().getNgo().getId().equals(ngo.getId())) {
            throw new IllegalStateException("You can only answer questions about your own pets");
        }

        question.setAnswer(request.getAnswer());
        question.setAnsweredAt(LocalDateTime.now());

        return toResponse(questionRepository.save(question));
    }

    public List<QuestionResponse> getQuestionsForPet(Long petId) {
        return questionRepository.findByPetIdOrderByCreatedAtDesc(petId).stream()
                .map(this::toResponse)
                .toList();
    }

    private QuestionResponse toResponse(Question q) {
        return QuestionResponse.builder()
                .id(q.getId())
                .petId(q.getPet().getId())
                .askedByName(q.getUser().getName())
                .question(q.getQuestion())
                .answer(q.getAnswer())
                .createdAt(q.getCreatedAt())
                .answeredAt(q.getAnsweredAt())
                .build();
    }
}