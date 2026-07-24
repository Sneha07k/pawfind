package com.pawfind.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import com.pawfind.entity.Application;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class AgreementPdfService {

    public byte[] generateAgreementPdf(Application application, byte[] signatureImageBytes) {
        try {
            Document document = new Document(PageSize.A4, 50, 50, 50, 50);
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = new Font(Font.HELVETICA, 20, Font.BOLD);
            Font headingFont = new Font(Font.HELVETICA, 13, Font.BOLD);
            Font bodyFont = new Font(Font.HELVETICA, 11, Font.NORMAL);

            Paragraph title = new Paragraph("Pet Adoption Agreement", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            document.add(new Paragraph("Adopter Details", headingFont));
            document.add(new Paragraph("Name: " + application.getFullName(), bodyFont));
            document.add(new Paragraph("Phone: " + application.getPhoneNumber(), bodyFont));
            document.add(new Paragraph("Address: " + application.getAddress(), bodyFont));
            document.add(new Paragraph(" "));

            document.add(new Paragraph("NGO / Shelter Details", headingFont));
            document.add(
                    new Paragraph("Organization: " + application.getPet().getNgo().getOrganizationName(), bodyFont));
            document.add(new Paragraph("Address: " + application.getPet().getNgo().getAddress(), bodyFont));
            document.add(new Paragraph(" "));

            document.add(new Paragraph("Pet Details", headingFont));
            document.add(new Paragraph("Name: " + application.getPet().getName(), bodyFont));
            document.add(new Paragraph("Species / Breed: " + application.getPet().getSpecies()
                    + (application.getPet().getBreed() != null ? " / " + application.getPet().getBreed() : ""),
                    bodyFont));
            document.add(new Paragraph(" "));

            document.add(new Paragraph("Adoption Terms", headingFont));
            document.add(new Paragraph(
                    "The adopter named above agrees to provide a safe, loving, and permanent home for the pet " +
                            "described above. The adopter agrees to provide proper food, shelter, veterinary care, and "
                            +
                            "affection for the lifetime of the pet. The adopter understands that this is a lifelong " +
                            "commitment and agrees not to abandon, neglect, or resell the pet. The shelter reserves the "
                            +
                            "right to follow up on the pet's wellbeing after adoption.",
                    bodyFont));
            document.add(new Paragraph(" "));

            if (signatureImageBytes != null) {
                document.add(new Paragraph("Adopter's Signature:", headingFont));
                Image signature = Image.getInstance(signatureImageBytes);
                signature.scaleToFit(200, 80);
                document.add(signature);
            }

            document.add(new Paragraph(" "));
            document.add(new Paragraph(
                    "Date: " + application.getApplicationDate().format(DateTimeFormatter.ofPattern("dd MMM yyyy")),
                    bodyFont));

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new IllegalStateException("Failed to generate agreement PDF: " + e.getMessage());
        }
    }
}