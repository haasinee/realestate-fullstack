package com.realestate.controller;

import com.realestate.dto.PropertyDTO;
import com.realestate.service.PropertyService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
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
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(propertyService.getById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<PropertyDTO.Response>> search(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {
        return ResponseEntity.ok(propertyService.search(city, type, minPrice, maxPrice));
    }

    @GetMapping("/keyword")
    public ResponseEntity<List<PropertyDTO.Response>> searchByKeyword(
            @RequestParam String q) {
        return ResponseEntity.ok(propertyService.searchByKeyword(q));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> create(@Valid @RequestBody PropertyDTO.CreateRequest req,
                                     Authentication auth) {
        try {
            return ResponseEntity.ok(propertyService.create(req, auth.getName()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> update(@PathVariable Long id,
                                     @Valid @RequestBody PropertyDTO.CreateRequest req) {
        try {
            return ResponseEntity.ok(propertyService.update(id, req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        propertyService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Property deleted"));
    }

    @PostMapping("/{id}/images")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadImage(@PathVariable Long id,
                                          @RequestParam("file") MultipartFile file,
                                          @RequestParam(defaultValue = "false") boolean isPrimary) {
        try {
            String url = propertyService.uploadImage(id, file, isPrimary);
            return ResponseEntity.ok(Map.of("imageUrl", url));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(propertyService.getStats());
    }
}
