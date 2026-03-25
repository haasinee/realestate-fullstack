package com.realestate.controller;

import com.realestate.dto.ReviewRequest;
import com.realestate.entity.Property;
import com.realestate.entity.Review;
import com.realestate.entity.User;
import com.realestate.service.PropertyService;
import com.realestate.service.ReviewService;
import com.realestate.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;
    private final UserService userService;
    private final PropertyService propertyService;

    public ReviewController(ReviewService reviewService, UserService userService, PropertyService propertyService) {
        this.reviewService = reviewService;
        this.userService = userService;
        this.propertyService = propertyService;
    }

    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody ReviewRequest request) {
        User user = userService.getUserById(request.getUserId()).orElse(null);
        Property property = propertyService.getPropertyById(request.getPropertyId()).orElse(null);

        if (user == null || property == null) {
            return ResponseEntity.badRequest().build();
        }

        Review review = new Review();
        review.setUser(user);
        review.setProperty(property);
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        return ResponseEntity.ok(reviewService.createReview(review));
    }
}
