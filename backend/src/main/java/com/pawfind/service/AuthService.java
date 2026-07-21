package com.pawfind.service;

import com.pawfind.dto.auth.*;
import com.pawfind.entity.User;
import com.pawfind.entity.enums.OtpPurpose;
import com.pawfind.entity.enums.Role;
import com.pawfind.repository.UserRepository;
import com.pawfind.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final OtpService otpService;

    public MessageResponse register(RegisterRequest request) {
        if (request.getRole() == Role.ADMIN) {
            throw new IllegalStateException("Admin accounts cannot be self-registered");
        }

        User existing = userRepository.findByEmail(request.getEmail()).orElse(null);

        if (existing != null) {
            if (existing.isVerified()) {
                throw new IllegalStateException("Email is already registered");
            }
            // Unverified account from a previous, abandoned attempt — let them retry
            // instead of getting permanently locked out of their own email.
            existing.setName(request.getName());
            existing.setPassword(passwordEncoder.encode(request.getPassword()));
            existing.setRole(request.getRole());
            userRepository.save(existing);
            otpService.generateAndSend(existing.getEmail(), OtpPurpose.VERIFY_EMAIL, "email verification");
            return new MessageResponse("An account with this email already exists but isn't verified yet. We've sent a new OTP — please check your email.");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .verified(false)
                .build();

        userRepository.save(user);
        otpService.generateAndSend(user.getEmail(), OtpPurpose.VERIFY_EMAIL, "email verification");

        return new MessageResponse("Registration successful. Please check your email for the OTP to verify your account.");
    }

    public AuthResponse verifyOtpAndActivate(VerifyOtpRequest request) {
        otpService.verify(request.getEmail(), request.getOtp(), OtpPurpose.VERIFY_EMAIL);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalStateException("User not found"));
        user.setVerified(true);
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId());
        return AuthResponse.builder()
                .token(token).userId(user.getId()).name(user.getName())
                .email(user.getEmail()).role(user.getRole().name())
                .build();
    }

    public MessageResponse resendOtp(EmailRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalStateException("User not found"));
        if (user.isVerified()) {
            throw new IllegalStateException("This account is already verified");
        }
        otpService.generateAndSend(user.getEmail(), OtpPurpose.VERIFY_EMAIL, "email verification");
        return new MessageResponse("A new OTP has been sent to your email.");
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalStateException("User not found"));

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId());

        return AuthResponse.builder()
                .token(token).userId(user.getId()).name(user.getName())
                .email(user.getEmail()).role(user.getRole().name())
                .build();
    }

    public MessageResponse forgotPassword(EmailRequest request) {
        userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalStateException("No account found with this email"));
        otpService.generateAndSend(request.getEmail(), OtpPurpose.RESET_PASSWORD, "password reset");
        return new MessageResponse("An OTP to reset your password has been sent to your email.");
    }

    public MessageResponse resetPassword(ResetPasswordRequest request) {
        otpService.verify(request.getEmail(), request.getOtp(), OtpPurpose.RESET_PASSWORD);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalStateException("User not found"));
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return new MessageResponse("Password reset successful. You can now log in.");
    }
}