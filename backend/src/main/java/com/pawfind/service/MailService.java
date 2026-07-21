package com.pawfind.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp, String purposeLabel) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("PawFind — Your verification code");
        message.setText(
                "Hi there,\n\n" +
                        "Your OTP for " + purposeLabel + " is: " + otp + "\n" +
                        "This code expires in 5 minutes.\n\n" +
                        "If you didn't request this, you can safely ignore this email.\n\n" +
                        "— The PawFind Team"
        );
        mailSender.send(message);
    }
}