package com.pawfind.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public String uploadImage(MultipartFile file, String folder) {
        try {
            Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap("folder", folder));
            return (String) result.get("secure_url");
        } catch (IOException e) {
            throw new IllegalStateException("Image upload failed: " + e.getMessage());
        }
    }

    public String uploadBase64Image(String base64DataUrl, String folder) {
        try {
            Map<?, ?> result = cloudinary.uploader().upload(base64DataUrl, ObjectUtils.asMap("folder", folder));
            return (String) result.get("secure_url");
        } catch (IOException e) {
            throw new IllegalStateException("Signature upload failed: " + e.getMessage());
        }
    }

    public String uploadPdf(byte[] pdfBytes, String folder, String publicId) {
        try {
            Map<?, ?> result = cloudinary.uploader().upload(pdfBytes, ObjectUtils.asMap(
                    "folder", folder,
                    "public_id", publicId,
                    "resource_type", "raw"));
            return (String) result.get("secure_url");
        } catch (IOException e) {
            throw new IllegalStateException("PDF upload failed: " + e.getMessage());
        }
    }
}