package com.realestate.service;

import com.realestate.dto.BookingDTO;
import com.realestate.dto.ReviewDTO;
import com.realestate.dto.UserProfileDTO;
import com.realestate.entity.User;
import com.realestate.repository.BookingRepository;
import com.realestate.repository.ReviewRepository;
import com.realestate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired private UserRepository userRepository;
    @Autowired private BookingRepository bookingRepository;
    @Autowired private ReviewRepository reviewRepository;

    public UserProfileDTO getProfile(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();

        UserProfileDTO profile = new UserProfileDTO();
        profile.setId(user.getId());
        profile.setFirstName(user.getFirstName());
        profile.setLastName(user.getLastName());
        profile.setEmail(user.getEmail());
        profile.setPhone(user.getPhone());
        profile.setRole(user.getRole().name());
        profile.setCreatedAt(user.getCreatedAt());

        profile.setBookings(bookingRepository.findByUserId(user.getId()).stream().map(booking -> {
            BookingDTO.Response res = new BookingDTO.Response();
            res.setId(booking.getId());
            res.setPropertyId(booking.getProperty().getId());
            res.setPropertyTitle(booking.getProperty().getTitle());
            res.setPropertyCity(booking.getProperty().getCity());
            res.setUserId(booking.getUser().getId());
            res.setUserName(booking.getUser().getFirstName() + " " + booking.getUser().getLastName());
            res.setVisitDate(booking.getVisitDate());
            res.setVisitTime(booking.getVisitTime());
            res.setVisitorName(booking.getVisitorName());
            res.setVisitorPhone(booking.getVisitorPhone());
            res.setStatus(booking.getStatus().name());
            res.setNotes(booking.getNotes());
            res.setCreatedAt(booking.getCreatedAt());
            return res;
        }).collect(Collectors.toList()));

        profile.setReviews(reviewRepository.findByUserId(user.getId()).stream().map(review -> {
            ReviewDTO.Response res = new ReviewDTO.Response();
            res.setId(review.getId());
            res.setPropertyId(review.getProperty().getId());
            res.setUserId(review.getUser().getId());
            res.setUserName(review.getUser().getFirstName() + " " + review.getUser().getLastName());
            res.setRating(review.getRating());
            res.setComment(review.getComment());
            res.setCreatedAt(review.getCreatedAt());
            return res;
        }).collect(Collectors.toList()));

        return profile;
    }
}
