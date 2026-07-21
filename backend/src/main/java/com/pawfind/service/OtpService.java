package com.pawfind.service;

import com.pawfind.entity.Otp;
import com.pawfind.entity.enums.OtpPurpose;
import com.pawfind.repository.OtpRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpRepository otpRepository;
    private final MailService mailService;

    @Value("${otp.expiry-minutes}")
    private int expiryMinutes;

    private static final SecureRandom RANDOM = new SecureRandom();

    public void generateAndSend(String email, OtpPurpose purpose, String purposeLabel) {
        String code = String.format("%06d", RANDOM.nextInt(1_000_000));

        Otp otp = Otp.builder()
                .email(email)
                .otp(code)
                .purpose(purpose)
                .expiryTime(LocalDateTime.now().plusMinutes(expiryMinutes))
                .used(false)
                .build();
        otpRepository.save(otp);

        mailService.sendOtpEmail(email, code, purposeLabel);
    }

    public void verify(String email, String code, OtpPurpose purpose) {
        Otp otp = otpRepository.findTopByEmailAndPurposeOrderByIdDesc(email, purpose)
                .orElseThrow(() -> new IllegalStateException("No OTP request found for this email"));

        if (otp.isUsed()) {
            throw new IllegalStateException("This OTP has already been used");
        }
        if (otp.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("OTP has expired. Please request a new one");
        }
        if (!otp.getOtp().equals(code)) {
            throw new IllegalStateException("Incorrect OTP");
        }

        otp.setUsed(true);
        otpRepository.save(otp);
    }
}