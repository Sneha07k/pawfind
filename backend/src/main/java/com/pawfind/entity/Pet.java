package com.pawfind.entity;

import com.pawfind.entity.enums.Gender;
import com.pawfind.entity.enums.PetStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "ngo_id", nullable = false)
    private Ngo ngo;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String species;

    private String breed;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private Integer age; // in months

    @Column(nullable = false)
    @Builder.Default
    private boolean vaccinated = false;

    @Column(nullable = false)
    @Builder.Default
    private boolean sterilized = false;

    @Column(columnDefinition = "TEXT")
    private String healthInfo;

    @Column(columnDefinition = "TEXT")
    private String story;

    private Double latitude;

    private Double longitude;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PetStatus status = PetStatus.AVAILABLE;

    @OneToMany(mappedBy = "pet", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<PetImage> images = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
