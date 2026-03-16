package com.realestate.service;

import com.realestate.dto.ReviewDTO;
import com.realestate.entity.*;
import com.realestate.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired private ReviewRepository reviewRepository;
    @Autowired private PropertyRepository propertyRepository;
    @Autowired private UserRepository userRepository;

    public List<ReviewDTO.Response> getByProperty(Long propertyId) {
        return reviewRepository.findByPropertyId(propertyId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ReviewDTO.Response create(ReviewDTO.CreateRequest req, String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Property property = propertyRepository.findById(req.getPropertyId())
                .orElseThrow(() -> new RuntimeException("Property not found"));
        if (reviewRepository.existsByPropertyIdAndUserId(property.getId(), user.getId())) {
            throw new RuntimeException("You have already reviewed this property");
        }
        Review review = Review.builder()
                .property(property)
                .user(user)
                .rating(req.getRating())
                .comment(req.getComment())
                .build();
        return toResponse(reviewRepository.save(review));
    }

    public void delete(Long id) {
        reviewRepository.deleteById(id);
    }

    private ReviewDTO.Response toResponse(Review r) {
        ReviewDTO.Response res = new ReviewDTO.Response();
        res.setId(r.getId());
        res.setPropertyId(r.getProperty().getId());
        res.setUserId(r.getUser().getId());
        res.setUserName(r.getUser().getFirstName() + " " + r.getUser().getLastName());
        res.setRating(r.getRating());
        res.setComment(r.getComment());
        res.setCreatedAt(r.getCreatedAt());
        return res;
    }
}
