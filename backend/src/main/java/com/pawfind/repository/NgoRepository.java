package com.pawfind.repository;

import com.pawfind.entity.Ngo;
import com.pawfind.entity.enums.NgoStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NgoRepository extends JpaRepository<Ngo, Long> {
    Optional<Ngo> findByUserId(Long userId);
    List<Ngo> findByStatus(NgoStatus status);
}