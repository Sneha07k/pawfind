package com.pawfind.service;

import com.pawfind.entity.Pet;
import com.pawfind.entity.enums.Gender;
import com.pawfind.entity.enums.PetStatus;
import org.springframework.data.jpa.domain.Specification;

public class PetSpecification {

    public static Specification<Pet> withFilters(
            String species, String breed, Gender gender,
            Integer minAge, Integer maxAge,
            Boolean vaccinated, String location) {

        return (root, query, cb) -> {
            var predicates = cb.conjunction();

            // Only ever show pets that are actually available for adoption
            predicates = cb.and(predicates, cb.equal(root.get("status"), PetStatus.AVAILABLE));

            if (species != null && !species.isBlank()) {
                predicates = cb.and(predicates, cb.equal(cb.lower(root.get("species")), species.toLowerCase()));
            }
            if (breed != null && !breed.isBlank()) {
                predicates = cb.and(predicates, cb.like(cb.lower(root.get("breed")), "%" + breed.toLowerCase() + "%"));
            }
            if (gender != null) {
                predicates = cb.and(predicates, cb.equal(root.get("gender"), gender));
            }
            if (minAge != null) {
                predicates = cb.and(predicates, cb.greaterThanOrEqualTo(root.get("age"), minAge));
            }
            if (maxAge != null) {
                predicates = cb.and(predicates, cb.lessThanOrEqualTo(root.get("age"), maxAge));
            }
            if (vaccinated != null) {
                predicates = cb.and(predicates, cb.equal(root.get("vaccinated"), vaccinated));
            }
            // "location" is a loose text filter against the NGO's address for now;
            // proper radius-based search happens in Phase 7 with real map coordinates.
            if (location != null && !location.isBlank()) {
                predicates = cb.and(predicates,
                        cb.like(cb.lower(root.get("ngo").get("address")), "%" + location.toLowerCase() + "%"));
            }

            return predicates;
        };
    }
}