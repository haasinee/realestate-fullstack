package com.realestate.dto;

import com.realestate.entity.Property;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class PropertyDTO {

    @Data
    public static class CreateRequest {
        @NotBlank
        private String title;
        private String description;
        @NotNull
        private Property.PropertyType propertyType;
        @NotNull
        private BigDecimal price;
        private Integer areaSqft;
        private Integer bedrooms = 0;
        private Integer bathrooms = 0;
        private Integer floorNumber;
        private Integer yearBuilt;
        private String address;
        private String city;
        private String state;
        private String pincode;
        private Double latitude;
        private Double longitude;
        private String amenities;
        private Boolean isFeatured = false;
        private String agentName;
        private String agentPhone;
    }

    @Data
    public static class Response {
        private Long id;
        private String title;
        private String description;
        private String propertyType;
        private String status;
        private BigDecimal price;
        private Integer areaSqft;
        private Integer bedrooms;
        private Integer bathrooms;
        private Integer floorNumber;
        private Integer yearBuilt;
        private String address;
        private String city;
        private String state;
        private String pincode;
        private Double latitude;
        private Double longitude;
        private String amenities;
        private Boolean isFeatured;
        private String agentName;
        private String agentPhone;
        private List<String> imageUrls;
        private Double averageRating;
        private Long reviewCount;
        private LocalDateTime createdAt;
    }
}
