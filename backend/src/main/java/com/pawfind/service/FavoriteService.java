package com.pawfind.service;

import com.pawfind.dto.favorite.FavoriteToggleResponse;
import com.pawfind.dto.pet.PetResponse;
import com.pawfind.entity.Favorite;
import com.pawfind.entity.Pet;
import com.pawfind.entity.User;
import com.pawfind.repository.FavoriteRepository;
import com.pawfind.repository.PetImageRepository;
import com.pawfind.repository.PetRepository;
import com.pawfind.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final PetRepository petRepository;
    private final UserRepository userRepository;
    private final PetService petService;

    @Transactional
    public FavoriteToggleResponse toggle(String email, Long petId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found"));
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new IllegalStateException("Pet not found"));

        var existing = favoriteRepository.findByUserIdAndPetId(user.getId(), pet.getId());

        if (existing.isPresent()) {
            favoriteRepository.delete(existing.get());
            return new FavoriteToggleResponse(false);
        } else {
            Favorite favorite = Favorite.builder().user(user).pet(pet).build();
            favoriteRepository.save(favorite);
            return new FavoriteToggleResponse(true);
        }
    }

    public List<PetResponse> getMyFavorites(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        return favoriteRepository.findByUserId(user.getId()).stream()
                .map(fav -> petService.getPet(fav.getPet().getId()))
                .toList();
    }

    public boolean isFavorited(String email, Long petId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found"));
        return favoriteRepository.findByUserIdAndPetId(user.getId(), petId).isPresent();
    }
}