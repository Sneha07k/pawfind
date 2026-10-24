package com.pawfind.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MailService {

    private static final String BREVO_URL = "https://api.brevo.com/v3/smtp/email";

    private final JavaMailSender mailSender;
    private final RestClient restClient = RestClient.create();

    // When set, mail goes through Brevo's HTTPS API (needed on hosts that block SMTP ports, e.g. Render free tier).
    // When empty, falls back to SMTP via spring.mail.* (local development).
    @Value("${BREVO_API_KEY:}")
    private String brevoApiKey;

    @Value("${spring.mail.username}")
    private String senderEmail;

    public void sendOtpEmail(String toEmail, String otp, String purposeLabel) {
        String subject = "PawFind — Your verification code";
        String text = "Hi there,\n\n" +
                "Your OTP for " + purposeLabel + " is: " + otp + "\n" +
                "This code expires in 5 minutes.\n\n" +
                "If you didn't request this, you can safely ignore this email.\n\n" +
                "— The PawFind Team";
        send(toEmail, subject, text);
    }

    private void send(String toEmail, String subject, String text) {
        if (brevoApiKey.isBlank()) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
            return;
        }

        // Throws RestClientResponseException on a non-2xx response, like mailSender.send throws MailException
        restClient.post()
                .uri(BREVO_URL)
                .header("api-key", brevoApiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of(
                        "sender", Map.of("name", "PawFind", "email", senderEmail),
                        "to", List.of(Map.of("email", toEmail)),
                        "subject", subject,
                        "textContent", text
                ))
                .retrieve()
                .toBodilessEntity();
    }
}
