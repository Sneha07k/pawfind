package com.pawfind.repository;

import com.pawfind.entity.Application;
import com.pawfind.entity.enums.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByAdopterId(Long adopterId);
    List<Application> findByPetNgoId(Long ngoId);
    List<Application> findByPetNgoIdAndStatus(Long ngoId, ApplicationStatus status);
}
