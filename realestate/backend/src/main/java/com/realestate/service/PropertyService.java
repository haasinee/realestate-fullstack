package com.realestate.service;

import com.realestate.dto.PropertyCreateRequest;
import com.realestate.dto.PropertyDTO;
import com.realestate.dto.PropertyResponse;
import com.realestate.entity.*;
import com.realestate.exception.ResourceNotFoundException;
import com.realestate.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PropertyService {

    @Autowired private PropertyRepository propertyRepository;
    @Autowired private PropertyImageRepository imageRepository;
    @Autowired private ReviewRepository reviewRepository;
    @Autowired private UserRepository userRepository;

    @Value("${file.upload.dir}")
    private String uploadDir;

    public List<PropertyDTO.Response> getAllActive() {
        return propertyRepository.findByStatus(Property.Status.ACTIVE)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<PropertyDTO.Response> getFeatured() {
        return propertyRepository.findByIsFeaturedTrue()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public PropertyDTO.Response getById(Long id) {
        Property p = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));
        return toResponse(p);
    }

    public List<PropertyDTO.Response> search(String name, String location,
                                              BigDecimal minPrice, BigDecimal maxPrice,
                                              Property.PropertyType propertyType) {
        String nameParam = (name == null) ? null : name.trim();
        String locationParam = (location == null) ? null : location.trim();

        boolean noFilters = (nameParam == null || nameParam.isEmpty())
                && (locationParam == null || locationParam.isEmpty())
                && minPrice == null
                && maxPrice == null
                && propertyType == null;

        if (noFilters) {
            return getAllActive();
        }

        return propertyRepository.searchProperties(nameParam, locationParam, minPrice, maxPrice, propertyType, Property.Status.ACTIVE)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<PropertyDTO.Response> searchByKeyword(String keyword) {
        String keywordParam = keyword == null ? "" : keyword.trim();
        if (keywordParam.isEmpty()) {
            return getAllActive();
        }
        return propertyRepository.findByKeyword(keywordParam, Property.Status.ACTIVE)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public PropertyDTO.Response create(PropertyDTO.CreateRequest req, String email) {
        User admin = userRepository.findByEmail(email).orElseThrow();
        Property p = Property.builder()
                .title((req.getTitle() != null && !req.getTitle().isBlank()) ? req.getTitle() : req.getPropertyName())
                .propertyName(req.getPropertyName())
                .description(req.getDescription())
                .propertyType(req.getPropertyType() != null ? req.getPropertyType() : Property.PropertyType.APARTMENT)
                .price(req.getPrice())
                .location(req.getLocation())
                .imageUrl(req.getImageUrl())
                .area(req.getArea())
                .bedrooms(req.getBedrooms() != null ? req.getBedrooms() : 0)
                .bathrooms(req.getBathrooms() != null ? req.getBathrooms() : 0)
                .floorNumber(req.getFloorNumber())
                .yearBuilt(req.getYearBuilt())
                .address(req.getAddress())
                .city(req.getCity())
                .state(req.getState())
                .pincode(req.getPincode())
                .latitude(req.getLatitude())
                .longitude(req.getLongitude())
                .amenities(req.getAmenities())
                .isFeatured(req.getIsFeatured() != null ? req.getIsFeatured() : false)
                .agentName(req.getAgentName())
                .agentPhone(req.getAgentPhone())
                .status(Property.Status.ACTIVE)
                .createdBy(admin)
                .build();
        return toResponse(propertyRepository.save(p));
    }


    public PropertyResponse addProperty(PropertyCreateRequest req) {
        Property property = Property.builder()
                .title(req.getTitle().trim())
                .description(req.getDescription())
                .price(req.getPrice())
                .city(req.getCity().trim())
                .address(req.getAddress().trim())
                .bedrooms(req.getBedrooms())
                .bathrooms(req.getBathrooms())
                .propertyType(req.getPropertyType())
                .status(req.getStatus())
                .build();

        Property saved = propertyRepository.save(property);
        return PropertyResponse.builder()
                .id(saved.getId())
                .title(saved.getTitle())
                .description(saved.getDescription())
                .price(saved.getPrice())
                .city(saved.getCity())
                .address(saved.getAddress())
                .bedrooms(saved.getBedrooms())
                .bathrooms(saved.getBathrooms())
                .propertyType(saved.getPropertyType())
                .status(saved.getStatus())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    public PropertyDTO.Response update(Long id, PropertyDTO.CreateRequest req) {
        Property p = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));
        p.setTitle((req.getTitle() != null && !req.getTitle().isBlank()) ? req.getTitle() : req.getPropertyName());
        p.setPropertyName(req.getPropertyName());
        p.setDescription(req.getDescription());
        p.setPropertyType(req.getPropertyType() != null ? req.getPropertyType() : Property.PropertyType.APARTMENT);
        p.setPrice(req.getPrice());
        p.setLocation(req.getLocation());
        p.setImageUrl(req.getImageUrl());
        p.setArea(req.getArea());
        p.setBedrooms(req.getBedrooms() != null ? req.getBedrooms() : 0);
        p.setBathrooms(req.getBathrooms() != null ? req.getBathrooms() : 0);
        p.setFloorNumber(req.getFloorNumber());
        p.setYearBuilt(req.getYearBuilt());
        p.setAddress(req.getAddress());
        p.setCity(req.getCity());
        p.setState(req.getState());
        p.setPincode(req.getPincode());
        p.setLatitude(req.getLatitude());
        p.setLongitude(req.getLongitude());
        p.setAmenities(req.getAmenities());
        p.setIsFeatured(req.getIsFeatured() != null ? req.getIsFeatured() : false);
        p.setAgentName(req.getAgentName());
        p.setAgentPhone(req.getAgentPhone());
        return toResponse(propertyRepository.save(p));
    }

    public void delete(Long id) {
        propertyRepository.deleteById(id);
    }

    public String uploadImage(Long propertyId, MultipartFile file, boolean isPrimary) throws IOException {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        String imageUrl = "/uploads/" + filename;
        if (isPrimary) {
            property.setImageUrl(imageUrl);
            propertyRepository.save(property);
        }
        PropertyImage img = PropertyImage.builder()
                .property(property)
                .imageUrl(imageUrl)
                .isPrimary(isPrimary)
                .build();
        imageRepository.save(img);
        return imageUrl;
    }

    public Map<String, Long> getStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalProperties", propertyRepository.count());
        stats.put("activeProperties", propertyRepository.countByStatus(Property.Status.ACTIVE));
        stats.put("soldProperties", propertyRepository.countByStatus(Property.Status.SOLD));
        return stats;
    }

    public PropertyDTO.Response toResponse(Property p) {
        PropertyDTO.Response r = new PropertyDTO.Response();
        r.setId(p.getId());
        r.setTitle(p.getTitle());
        r.setPropertyName(p.getPropertyName() != null ? p.getPropertyName() : p.getTitle());
        r.setDescription(p.getDescription());
        r.setPropertyType(p.getPropertyType().name());
        r.setStatus(p.getStatus().name());
        r.setPrice(p.getPrice());
        r.setLocation(p.getLocation() != null ? p.getLocation() : p.getCity());
        r.setImageUrl(p.getImageUrl());
        r.setArea(p.getArea());
        r.setBedrooms(p.getBedrooms());
        r.setBathrooms(p.getBathrooms());
        r.setFloorNumber(p.getFloorNumber());
        r.setYearBuilt(p.getYearBuilt());
        r.setAddress(p.getAddress());
        r.setCity(p.getCity());
        r.setState(p.getState());
        r.setPincode(p.getPincode());
        r.setLatitude(p.getLatitude());
        r.setLongitude(p.getLongitude());
        r.setAmenities(p.getAmenities());
        r.setIsFeatured(p.getIsFeatured());
        r.setAgentName(p.getAgentName());
        r.setAgentPhone(p.getAgentPhone());
        r.setCreatedAt(p.getCreatedAt());
        if (p.getImages() != null) {
            r.setImageUrls(p.getImages().stream()
                    .map(PropertyImage::getImageUrl).collect(Collectors.toList()));
        }
        r.setAverageRating(reviewRepository.findAverageRatingByPropertyId(p.getId()));
        r.setReviewCount(reviewRepository.countByPropertyId(p.getId()));
        return r;
    }
}
