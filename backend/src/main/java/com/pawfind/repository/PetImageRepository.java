package com.pawfind.repository;

import com.pawfind.entity.PetImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PetImageRepository extends JpaRepository<PetImage, Long> {
}
