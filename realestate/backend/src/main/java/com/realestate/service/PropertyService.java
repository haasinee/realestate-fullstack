package com.realestate.service;

import com.realestate.dto.PropertyDTO;
import com.realestate.entity.*;
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
                .orElseThrow(() -> new RuntimeException("Property not found"));
        return toResponse(p);
    }

    public List<PropertyDTO.Response> search(String city, String type,
                                              BigDecimal minPrice, BigDecimal maxPrice) {
        String cityParam = (city != null) ? city : "";
        Property.PropertyType pType = null;
        if (type != null && !type.isBlank()) {
            pType = Property.PropertyType.valueOf(type.toUpperCase());
        }
        return propertyRepository.searchProperties(cityParam, pType, minPrice, maxPrice)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<PropertyDTO.Response> searchByKeyword(String keyword) {
        return propertyRepository.findByKeyword(keyword)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public PropertyDTO.Response create(PropertyDTO.CreateRequest req, String email) {
        User admin = userRepository.findByEmail(email).orElseThrow();
        Property p = Property.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .propertyType(req.getPropertyType())
                .price(req.getPrice())
                .areaSqft(req.getAreaSqft())
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

    public PropertyDTO.Response update(Long id, PropertyDTO.CreateRequest req) {
        Property p = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));
        p.setTitle(req.getTitle());
        p.setDescription(req.getDescription());
        p.setPropertyType(req.getPropertyType());
        p.setPrice(req.getPrice());
        p.setAreaSqft(req.getAreaSqft());
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
                .orElseThrow(() -> new RuntimeException("Property not found"));
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        String imageUrl = "/uploads/" + filename;
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
        r.setDescription(p.getDescription());
        r.setPropertyType(p.getPropertyType().name());
        r.setStatus(p.getStatus().name());
        r.setPrice(p.getPrice());
        r.setAreaSqft(p.getAreaSqft());
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
