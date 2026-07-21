package com.pawfind.service;

import com.pawfind.dto.pet.PetRequest;
import com.pawfind.dto.pet.PetResponse;
import com.pawfind.entity.Ngo;
import com.pawfind.entity.Pet;
import com.pawfind.entity.PetImage;
import com.pawfind.entity.User;
import com.pawfind.entity.enums.NgoStatus;
import com.pawfind.entity.enums.PetStatus;
import com.pawfind.repository.NgoRepository;
import com.pawfind.repository.PetImageRepository;
import com.pawfind.repository.PetRepository;
import com.pawfind.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PetService {

    private final PetRepository petRepository;
    private final PetImageRepository petImageRepository;
    private final NgoRepository ngoRepository;
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;

    public PetResponse createPet(String email, PetRequest request) {
        Ngo ngo = getApprovedNgoForUser(email);

        Pet pet = Pet.builder()
                .ngo(ngo)
                .name(request.getName())
                .species(request.getSpecies())
                .breed(request.getBreed())
                .gender(request.getGender())
                .age(request.getAge())
                .vaccinated(request.isVaccinated())
                .sterilized(request.isSterilized())
                .healthInfo(request.getHealthInfo())
                .story(request.getStory())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .status(PetStatus.AVAILABLE)
                .build();

        return toResponse(petRepository.save(pet));
    }

    public PetResponse updatePet(String email, Long petId, PetRequest request) {
        Pet pet = getOwnedPet(email, petId);

        pet.setName(request.getName());
        pet.setSpecies(request.getSpecies());
        pet.setBreed(request.getBreed());
        pet.setGender(request.getGender());
        pet.setAge(request.getAge());
        pet.setVaccinated(request.isVaccinated());
        pet.setSterilized(request.isSterilized());
        pet.setHealthInfo(request.getHealthInfo());
        pet.setStory(request.getStory());
        pet.setLatitude(request.getLatitude());
        pet.setLongitude(request.getLongitude());

        return toResponse(petRepository.save(pet));
    }

    public void deletePet(String email, Long petId) {
        petRepository.delete(getOwnedPet(email, petId));
    }

    public PetResponse getPet(Long petId) {
        return toResponse(petRepository.findById(petId)
                .orElseThrow(() -> new IllegalStateException("Pet not found")));
    }

    public List<PetResponse> listAvailablePets() {
        return petRepository.findAll().stream()
                .filter(p -> p.getStatus() == PetStatus.AVAILABLE)
                .map(this::toResponse)
                .toList();
    }

    public List<PetResponse> listMyPets(String email) {
        Ngo ngo = getNgoForUser(email);
        return petRepository.findAll().stream()
                .filter(p -> p.getNgo().getId().equals(ngo.getId()))
                .map(this::toResponse)
                .toList();
    }

    public PetResponse uploadImage(String email, Long petId, MultipartFile file) {
        Pet pet = getOwnedPet(email, petId);
        String url = cloudinaryService.uploadImage(file, "pawfind/pets/" + petId);

        PetImage image = PetImage.builder().pet(pet).imageUrl(url).build();
        petImageRepository.save(image);
        pet.getImages().add(image);

        return toResponse(pet);
    }

    public void deleteImage(String email, Long petId, Long imageId) {
        Pet pet = getOwnedPet(email, petId);
        PetImage image = petImageRepository.findById(imageId)
                .orElseThrow(() -> new IllegalStateException("Image not found"));

        if (!image.getPet().getId().equals(pet.getId())) {
            throw new IllegalStateException("This image does not belong to this pet");
        }
        petImageRepository.delete(image);
    }

    private Ngo getApprovedNgoForUser(String email) {
        Ngo ngo = getNgoForUser(email);
        if (ngo.getStatus() != NgoStatus.APPROVED) {
            throw new IllegalStateException("Your organization must be approved by an admin before you can list pets");
        }
        return ngo;
    }

    private Ngo getNgoForUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found"));
        return ngoRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalStateException(
                        "No organization profile found. Please complete your profile first"));
    }

    private Pet getOwnedPet(String email, Long petId) {
        Ngo ngo = getApprovedNgoForUser(email);
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new IllegalStateException("Pet not found"));
        if (!pet.getNgo().getId().equals(ngo.getId())) {
            throw new IllegalStateException("You do not have permission to modify this pet");
        }
        return pet;
    }

    private PetResponse toResponse(Pet pet) {
        return PetResponse.builder()
                .id(pet.getId())
                .ngoId(pet.getNgo().getId())
                .ngoName(pet.getNgo().getOrganizationName())
                .name(pet.getName())
                .species(pet.getSpecies())
                .breed(pet.getBreed())
                .gender(pet.getGender())
                .age(pet.getAge())
                .vaccinated(pet.isVaccinated())
                .sterilized(pet.isSterilized())
                .healthInfo(pet.getHealthInfo())
                .story(pet.getStory())
                .latitude(pet.getLatitude())
                .longitude(pet.getLongitude())
                .status(pet.getStatus())
                .images(pet.getImages().stream().map(PetImage::getImageUrl).toList())
                .createdAt(pet.getCreatedAt())
                .build();
    }
}