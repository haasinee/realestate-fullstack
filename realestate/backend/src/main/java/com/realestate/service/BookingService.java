package com.realestate.service;

import com.realestate.dto.BookingDTO;
import com.realestate.entity.*;
import com.realestate.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired private BookingRepository bookingRepository;
    @Autowired private PropertyRepository propertyRepository;
    @Autowired private UserRepository userRepository;

    public BookingDTO.Response create(BookingDTO.CreateRequest req, String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Property property = propertyRepository.findById(req.getPropertyId())
                .orElseThrow(() -> new RuntimeException("Property not found"));
        Booking booking = Booking.builder()
                .property(property)
                .user(user)
                .visitDate(req.getVisitDate())
                .visitTime(req.getVisitTime())
                .visitorName(req.getVisitorName())
                .visitorPhone(req.getVisitorPhone())
                .notes(req.getNotes())
                .status(Booking.BookingStatus.PENDING)
                .build();
        return toResponse(bookingRepository.save(booking));
    }

    public List<BookingDTO.Response> getMyBookings(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return bookingRepository.findByUserId(user.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<BookingDTO.Response> getAllBookings() {
        return bookingRepository.findAll()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public BookingDTO.Response updateStatus(Long id, String status) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(Booking.BookingStatus.valueOf(status.toUpperCase()));
        return toResponse(bookingRepository.save(booking));
    }

    public void cancel(Long id, String email) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        User user = userRepository.findByEmail(email).orElseThrow();
        if (!booking.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized");
        }
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

    public long countPending() {
        return bookingRepository.countByStatus(Booking.BookingStatus.PENDING);
    }

    private BookingDTO.Response toResponse(Booking b) {
        BookingDTO.Response r = new BookingDTO.Response();
        r.setId(b.getId());
        r.setPropertyId(b.getProperty().getId());
        r.setPropertyTitle(b.getProperty().getTitle());
        r.setPropertyCity(b.getProperty().getCity());
        r.setUserId(b.getUser().getId());
        r.setUserName(b.getUser().getFirstName() + " " + b.getUser().getLastName());
        r.setVisitDate(b.getVisitDate());
        r.setVisitTime(b.getVisitTime());
        r.setVisitorName(b.getVisitorName());
        r.setVisitorPhone(b.getVisitorPhone());
        r.setStatus(b.getStatus().name());
        r.setNotes(b.getNotes());
        r.setCreatedAt(b.getCreatedAt());
        return r;
    }
}
