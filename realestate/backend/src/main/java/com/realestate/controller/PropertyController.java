package com.realestate.controller;

import com.realestate.dto.PropertyDTO;
import com.realestate.entity.Property;
import com.realestate.service.PropertyService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    @Autowired
    private PropertyService propertyService;

    @GetMapping
    public ResponseEntity<List<PropertyDTO.Response>> getAll() {
        return ResponseEntity.ok(propertyService.getAllActive());
    }

    @GetMapping("/featured")
    public ResponseEntity<List<PropertyDTO.Response>> getFeatured() {
        return ResponseEntity.ok(propertyService.getFeatured());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyDTO.Response> getById(@PathVariable Long id) {
        return ResponseEntity.ok(propertyService.getById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<PropertyDTO.Response>> search(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Property.PropertyType propertyType,
            @RequestParam(required = false) String q) {
        String nameParam = (name != null && !name.isBlank()) ? name.trim() : (q != null ? q.trim() : null);
        String locationParam = (location != null && !location.isBlank()) ? location.trim() : null;
        return ResponseEntity.ok(propertyService.search(nameParam, locationParam, minPrice, maxPrice, propertyType));
    }

    @GetMapping("/keyword")
    public ResponseEntity<List<PropertyDTO.Response>> searchByKeyword(
            @RequestParam String q) {
        return ResponseEntity.ok(propertyService.searchByKeyword(q));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PropertyDTO.Response> create(@Valid @RequestBody PropertyDTO.CreateRequest req,
                                     Authentication auth) {
        return ResponseEntity.ok(propertyService.create(req, auth.getName()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PropertyDTO.Response> update(@PathVariable Long id,
                                     @Valid @RequestBody PropertyDTO.CreateRequest req) {
        return ResponseEntity.ok(propertyService.update(id, req));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        propertyService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Property deleted"));
    }

    @PostMapping("/{id}/images")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> uploadImage(@PathVariable Long id,
                                          @RequestParam("file") MultipartFile file,
                                          @RequestParam(defaultValue = "false") boolean isPrimary) throws IOException {
        String url = propertyService.uploadImage(id, file, isPrimary);
        return ResponseEntity.ok(Map.of("imageUrl", url));
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(propertyService.getStats());
    }
}
