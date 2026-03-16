package com.realestate.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "properties")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "property_name", length = 200)
    private String propertyName;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "property_type", nullable = false)
    private PropertyType propertyType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.ACTIVE;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal price;

    @Column(length = 255)
    private String location;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "area_sqft")
    private Integer areaSqft;

    @Column(nullable = false)
    private Integer bedrooms = 0;

    @Column(nullable = false)
    private Integer bathrooms = 0;

    @Column(name = "floor_number")
    private Integer floorNumber;

    @Column(name = "year_built")
    private Integer yearBuilt;

    @Column(length = 255)
    private String address;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String state;

    @Column(length = 10)
    private String pincode;

    @Column(precision = 10, scale = 8)
    private Double latitude;

    @Column(precision = 11, scale = 8)
    private Double longitude;

    @Column(columnDefinition = "TEXT")
    private String amenities;

    @Column(name = "is_featured")
    private Boolean isFeatured = false;

    @Column(name = "agent_name", length = 100)
    private String agentName;

    @Column(name = "agent_phone", length = 20)
    private String agentPhone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PropertyImage> images;

    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Review> reviews;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum PropertyType {
        APARTMENT, VILLA, PENTHOUSE, COMMERCIAL
    }

    public enum Status {
        ACTIVE, SOLD, PENDING
    }
}
