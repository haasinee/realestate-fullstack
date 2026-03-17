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
        private String title;

        @NotBlank
        private String propertyName;

        private String description;

        @NotNull
        private BigDecimal price;

        private String location;
        private String imageUrl;
        private Double latitude;
        private Double longitude;

        private Property.PropertyType propertyType = Property.PropertyType.APARTMENT;
        private Integer area;
        private Integer bedrooms = 0;
        private Integer bathrooms = 0;
        private Integer floorNumber;
        private Integer yearBuilt;
        private String address;
        private String city;
        private String state;
        private String pincode;
        private String amenities;
        private Boolean isFeatured = false;
        private String agentName;
        private String agentPhone;
    }

    @Data
    public static class Response {
        private Long id;
        private String title;
        private String propertyName;
        private String description;
        private String propertyType;
        private String status;
        private BigDecimal price;
        private String location;
        private String imageUrl;
        private Integer area;
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
