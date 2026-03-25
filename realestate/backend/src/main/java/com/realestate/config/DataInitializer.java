package com.realestate.config;

import com.realestate.entity.Property;
import com.realestate.entity.User;
import com.realestate.repository.PropertyRepository;
import com.realestate.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner seedData(UserRepository userRepository, PropertyRepository propertyRepository) {
        return args -> {
            if (userRepository.count() == 0) {
                User user = new User();
                user.setFirstName("John");
                user.setLastName("Doe");
                user.setEmail("john.doe@example.com");
                user.setPassword("password123");
                user.setPhone("+1234567890");
                user.setRole(User.Role.USER);
                userRepository.save(user);
            }

            if (propertyRepository.count() == 0) {
                Property apartment = new Property();
                apartment.setTitle("Modern Apartment");
                apartment.setDescription("2BHK apartment in city center");
                apartment.setPropertyType(Property.PropertyType.APARTMENT);
                apartment.setStatus(Property.Status.ACTIVE);
                apartment.setPrice(new BigDecimal("120000.00"));
                apartment.setCity("New York");
                apartment.setAddress("123 Main Street");
                apartment.setBedrooms(2);
                apartment.setBathrooms(2);
                propertyRepository.save(apartment);

                Property villa = new Property();
                villa.setTitle("Luxury Villa");
                villa.setDescription("Spacious villa with garden");
                villa.setPropertyType(Property.PropertyType.VILLA);
                villa.setStatus(Property.Status.ACTIVE);
                villa.setPrice(new BigDecimal("450000.00"));
                villa.setCity("Los Angeles");
                villa.setAddress("456 Sunset Blvd");
                villa.setBedrooms(4);
                villa.setBathrooms(3);
                propertyRepository.save(villa);
            }
        };
    }
}
