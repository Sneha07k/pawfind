package com.pawfind.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import com.pawfind.entity.Application;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class CertificatePdfService {

    public byte[] generateCertificatePdf(Application application, String certificateNumber) {
        try {
            Document document = new Document(PageSize.A4.rotate(), 40, 40, 40, 40);
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, out);
            document.open();

            Font brandFont = new Font(Font.HELVETICA, 16, Font.BOLD, new Color(53, 138, 99));
            Font titleFont = new Font(Font.HELVETICA, 28, Font.BOLD, new Color(37, 110, 78));
            Font subFont = new Font(Font.HELVETICA, 13, Font.ITALIC, Color.DARK_GRAY);
            Font nameFont = new Font(Font.HELVETICA, 22, Font.BOLD);
            Font bodyFont = new Font(Font.HELVETICA, 12, Font.NORMAL);
            Font smallFont = new Font(Font.HELVETICA, 10, Font.NORMAL, Color.GRAY);

            Paragraph brand = new Paragraph("PawFind", brandFont);
            brand.setAlignment(Element.ALIGN_CENTER);
            document.add(brand);

            Paragraph title = new Paragraph("Certificate of Adoption", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingBefore(15);
            title.setSpacingAfter(5);
            document.add(title);

            Paragraph sub = new Paragraph("This certifies that", subFont);
            sub.setAlignment(Element.ALIGN_CENTER);
            sub.setSpacingBefore(20);
            document.add(sub);

            Paragraph adopterName = new Paragraph(application.getFullName(), nameFont);
            adopterName.setAlignment(Element.ALIGN_CENTER);
            adopterName.setSpacingBefore(10);
            adopterName.setSpacingAfter(10);
            document.add(adopterName);

            Paragraph body = new Paragraph(
                    "has lovingly adopted " + application.getPet().getName() +
                            " (" + application.getPet().getSpecies() +
                            (application.getPet().getBreed() != null ? ", " + application.getPet().getBreed() : "") +
                            ") through " + application.getPet().getNgo().getOrganizationName() +
                            ", and has committed to providing a safe, caring, and permanent home.",
                    bodyFont);
            body.setAlignment(Element.ALIGN_CENTER);
            body.setSpacingAfter(30);
            document.add(body);

            Paragraph date = new Paragraph(
                    "Adoption Date: " + java.time.LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")),
                    bodyFont);
            date.setAlignment(Element.ALIGN_CENTER);
            document.add(date);

            Paragraph certNum = new Paragraph("Certificate No: " + certificateNumber, smallFont);
            certNum.setAlignment(Element.ALIGN_CENTER);
            certNum.setSpacingBefore(30);
            document.add(certNum);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new IllegalStateException("Failed to generate certificate PDF: " + e.getMessage());
        }
    }
}