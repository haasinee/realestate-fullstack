package com.realestate.controller;

import com.realestate.dto.ReviewDTO;
import com.realestate.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<ReviewDTO.Response>> getByProperty(@PathVariable Long propertyId) {
        return ResponseEntity.ok(reviewService.getByProperty(propertyId));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> create(@Valid @RequestBody ReviewDTO.CreateRequest req,
                                     Authentication auth) {
        try {
            return ResponseEntity.ok(reviewService.create(req, auth.getName()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        reviewService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Review deleted"));
    }
}
