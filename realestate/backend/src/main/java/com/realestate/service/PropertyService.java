package com.realestate.service;

import com.realestate.entity.Property;
import com.realestate.repository.PropertyRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;

    public PropertyService(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    public Optional<Property> getPropertyById(Long id) {
        return propertyRepository.findById(id);
    }

    public Property createProperty(Property property) {
        return propertyRepository.save(property);
    }

    public Property updateProperty(Long id, Property updatedProperty) {
        return propertyRepository.findById(id)
                .map(property -> {
                    property.setTitle(updatedProperty.getTitle());
                    property.setDescription(updatedProperty.getDescription());
                    property.setPropertyType(updatedProperty.getPropertyType());
                    property.setStatus(updatedProperty.getStatus());
                    property.setPrice(updatedProperty.getPrice());
                    property.setCity(updatedProperty.getCity());
                    property.setAddress(updatedProperty.getAddress());
                    property.setBedrooms(updatedProperty.getBedrooms());
                    property.setBathrooms(updatedProperty.getBathrooms());
                    return propertyRepository.save(property);
                })
                .orElseThrow(() -> new RuntimeException("Property not found"));
    }

    public void deleteProperty(Long id) {
        propertyRepository.deleteById(id);
    }
}
