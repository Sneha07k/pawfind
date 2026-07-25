package com.pawfind.service;

import com.pawfind.dto.story.SuccessStoryRequest;
import com.pawfind.dto.story.SuccessStoryResponse;
import com.pawfind.entity.Application;
import com.pawfind.entity.SuccessStory;
import com.pawfind.entity.User;
import com.pawfind.entity.enums.ApplicationStatus;
import com.pawfind.repository.ApplicationRepository;
import com.pawfind.repository.SuccessStoryRepository;
import com.pawfind.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SuccessStoryService {

    private final SuccessStoryRepository successStoryRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;

    public SuccessStoryResponse create(String email, Long petId, SuccessStoryRequest request) {
        User adopter = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        // Confirm this adopter actually completed an adoption for this specific pet —
        // stories aren't open-ended posts, they're tied to a real completed adoption.
        boolean completedThisAdoption = applicationRepository.findByAdopterId(adopter.getId()).stream()
                .anyMatch(a -> a.getPet().getId().equals(petId) && a.getStatus() == ApplicationStatus.COMPLETED);

        if (!completedThisAdoption) {
            throw new IllegalStateException("You can only share a success story for a pet you have completed adopting");
        }

        boolean alreadyShared = successStoryRepository.findAll().stream()
                .anyMatch(s -> s.getPet().getId().equals(petId) && s.getAdopter().getId().equals(adopter.getId()));
        if (alreadyShared) {
            throw new IllegalStateException("You've already shared a success story for this pet");
        }

        Application application = applicationRepository.findByAdopterId(adopter.getId()).stream()
                .filter(a -> a.getPet().getId().equals(petId) && a.getStatus() == ApplicationStatus.COMPLETED)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Completed application not found"));

        SuccessStory story = SuccessStory.builder()
                .pet(application.getPet())
                .adopter(adopter)
                .title(request.getTitle())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .build();

        return toResponse(successStoryRepository.save(story));
    }

    public SuccessStoryResponse uploadImage(String email, Long storyId, MultipartFile file) {
        SuccessStory story = getOwnedStory(email, storyId);
        String url = cloudinaryService.uploadImage(file, "pawfind/success-stories/" + storyId);
        story.setImageUrl(url);
        return toResponse(successStoryRepository.save(story));
    }

    public List<SuccessStoryResponse> listAll() {
        return successStoryRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt")).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<SuccessStoryResponse> listFeatured(int limit) {
        return listAll().stream().limit(limit).toList();
    }

    public List<SuccessStoryResponse> getMine(String email) {
        User adopter = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found"));
        return successStoryRepository.findAll().stream()
                .filter(s -> s.getAdopter().getId().equals(adopter.getId()))
                .map(this::toResponse)
                .toList();
    }

    private SuccessStory getOwnedStory(String email, Long storyId) {
        User adopter = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found"));
        SuccessStory story = successStoryRepository.findById(storyId)
                .orElseThrow(() -> new IllegalStateException("Story not found"));
        if (!story.getAdopter().getId().equals(adopter.getId())) {
            throw new IllegalStateException("You do not have permission to edit this story");
        }
        return story;
    }

    private SuccessStoryResponse toResponse(SuccessStory s) {
        return SuccessStoryResponse.builder()
                .id(s.getId())
                .petId(s.getPet().getId())
                .petName(s.getPet().getName())
                .petImage(s.getPet().getImages().isEmpty() ? null : s.getPet().getImages().get(0).getImageUrl())
                .adopterName(s.getAdopter().getName())
                .title(s.getTitle())
                .description(s.getDescription())
                .imageUrl(s.getImageUrl())
                .createdAt(s.getCreatedAt())
                .build();
    }
}