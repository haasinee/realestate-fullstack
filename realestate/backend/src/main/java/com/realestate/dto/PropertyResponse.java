package com.realestate.dto;

import com.realestate.entity.Property;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class PropertyResponse {
    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private String city;
    private String address;
    private Integer bedrooms;
    private Integer bathrooms;
    private Property.PropertyType propertyType;
    private Property.Status status;
    private LocalDateTime createdAt;
}
