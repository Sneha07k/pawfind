package com.pawfind.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pet_images")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PetImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    @Column(nullable = false)
    private String imageUrl;
}
