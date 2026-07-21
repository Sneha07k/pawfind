package com.pawfind.repository;

import com.pawfind.entity.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface PetRepository extends JpaRepository<Pet, Long>, JpaSpecificationExecutor<Pet> {
    // JpaSpecificationExecutor enables dynamic search/filter queries in Phase 6
}
