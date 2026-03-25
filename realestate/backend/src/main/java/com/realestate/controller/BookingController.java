package com.realestate.controller;

import com.realestate.dto.BookingRequest;
import com.realestate.entity.Booking;
import com.realestate.entity.Property;
import com.realestate.entity.User;
import com.realestate.service.BookingService;
import com.realestate.service.PropertyService;
import com.realestate.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final UserService userService;
    private final PropertyService propertyService;

    public BookingController(BookingService bookingService, UserService userService, PropertyService propertyService) {
        this.bookingService = bookingService;
        this.userService = userService;
        this.propertyService = propertyService;
    }

    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody BookingRequest request) {
        User user = userService.getUserById(request.getUserId()).orElse(null);
        Property property = propertyService.getPropertyById(request.getPropertyId()).orElse(null);

        if (user == null || property == null) {
            return ResponseEntity.badRequest().build();
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setProperty(property);
        booking.setVisitDate(request.getVisitDate());
        booking.setVisitTime(request.getVisitTime());
        booking.setStatus(Booking.BookingStatus.SCHEDULED);

        return ResponseEntity.ok(bookingService.createBooking(booking));
    }
}
