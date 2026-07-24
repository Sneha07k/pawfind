package com.pawfind.dto.application;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SignatureRequest {
    @NotBlank(message = "Signature is required")
    private String signatureDataUrl; // base64 PNG data URL from react-signature-canvas
}