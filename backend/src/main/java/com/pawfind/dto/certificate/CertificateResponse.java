package com.pawfind.dto.certificate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class CertificateResponse {
    private Long id;
    private Long applicationId;
    private String certificateNumber;
    private String pdfUrl;
    private String adopterName;
    private String petName;
    private String ngoName;
    private LocalDateTime issuedAt;
}