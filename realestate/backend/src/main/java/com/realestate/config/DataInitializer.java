package com.realestate.config;

import com.realestate.entity.Property;
import com.realestate.entity.User;
import com.realestate.repository.PropertyRepository;
import com.realestate.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedProperties(UserRepository userRepository, PropertyRepository propertyRepository) {
        return args -> {
            if (propertyRepository.count() > 0) {
                return;
            }

            User admin = userRepository.findByEmail("admin@estate.com").orElseGet(() ->
                    userRepository.save(User.builder()
                            .firstName("Admin")
                            .lastName("User")
                            .email("admin@estate.com")
                            .password("$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.")
                            .phone("+91 99999 00000")
                            .role(User.Role.ADMIN)
                            .build())
            );

            List<Property> sampleProperties = List.of(
                    createProperty("Skyline Penthouse", "Luxury penthouse with skyline views.", "Banjara Hills, Hyderabad", new BigDecimal("42000000"), "https://images.unsplash.com/photo-1613977257365-aaae5a9817ff?auto=format&fit=crop&w=1200&q=80", 17.4126, 78.4347, Property.PropertyType.PENTHOUSE, admin),
                    createProperty("Green Meadows Villa", "Spacious villa in gated community.", "Whitefield, Bangalore", new BigDecimal("28500000"), "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80", 12.9698, 77.7500, Property.PropertyType.VILLA, admin),
                    createProperty("Marine Drive Residency", "Sea-facing apartment near business district.", "Marine Drive, Mumbai", new BigDecimal("31000000"), "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80", 18.9440, 72.8237, Property.PropertyType.APARTMENT, admin),
                    createProperty("Tech Park Office Hub", "Premium office floors for enterprises.", "HITEC City, Hyderabad", new BigDecimal("64000000"), "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80", 17.4435, 78.3772, Property.PropertyType.COMMERCIAL, admin),
                    createProperty("Lakeview Apartments", "Modern apartment with clubhouse and pool.", "Hebbal, Bangalore", new BigDecimal("17200000"), "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80", 13.0358, 77.5970, Property.PropertyType.APARTMENT, admin),
                    createProperty("Palm Grove Villa", "Independent villa close to metro and schools.", "Powai, Mumbai", new BigDecimal("25500000"), "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80", 19.1176, 72.9060, Property.PropertyType.VILLA, admin),
                    createProperty("City Center Suites", "Compact apartment ideal for professionals.", "Gachibowli, Hyderabad", new BigDecimal("9800000"), "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80", 17.4401, 78.3489, Property.PropertyType.APARTMENT, admin),
                    createProperty("Royal Crest Penthouse", "Duplex penthouse with private terrace.", "Koramangala, Bangalore", new BigDecimal("39500000"), "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80", 12.9352, 77.6245, Property.PropertyType.PENTHOUSE, admin),
                    createProperty("Harbor Point Offices", "Commercial workspace with ample parking.", "BKC, Mumbai", new BigDecimal("71000000"), "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=1200&q=80", 19.0596, 72.8656, Property.PropertyType.COMMERCIAL, admin),
                    createProperty("Orchid Residency", "Family apartment near IT corridor.", "Madhapur, Hyderabad", new BigDecimal("15800000"), "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=1200&q=80", 17.4483, 78.3915, Property.PropertyType.APARTMENT, admin)
            );

            propertyRepository.saveAll(sampleProperties);
        };
    }

    private Property createProperty(String propertyName,
                                    String description,
                                    String location,
                                    BigDecimal price,
                                    String imageUrl,
                                    Double latitude,
                                    Double longitude,
                                    Property.PropertyType propertyType,
                                    User admin) {
        return Property.builder()
                .propertyName(propertyName)
                .title(propertyName)
                .description(description)
                .location(location)
                .city(location.contains(",") ? location.split(",")[1].trim() : location)
                .state("India")
                .price(price)
                .imageUrl(imageUrl)
                .latitude(latitude)
                .longitude(longitude)
                .propertyType(propertyType)
                .status(Property.Status.ACTIVE)
                .bedrooms(propertyType == Property.PropertyType.COMMERCIAL ? 0 : 3)
                .bathrooms(propertyType == Property.PropertyType.COMMERCIAL ? 4 : 2)
                .area(propertyType == Property.PropertyType.COMMERCIAL ? 5000 : 1800)
                .isFeatured(Boolean.FALSE)
                .createdBy(admin)
                .build();
    }
}
