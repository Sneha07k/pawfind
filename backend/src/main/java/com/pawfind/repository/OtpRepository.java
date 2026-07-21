package com.pawfind.repository;

import com.pawfind.entity.Otp;
import com.pawfind.entity.enums.OtpPurpose;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OtpRepository extends JpaRepository<Otp, Long> {
    Optional<Otp> findTopByEmailAndPurposeOrderByIdDesc(String email, OtpPurpose purpose);
}