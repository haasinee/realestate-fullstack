package com.realestate.service;

import com.realestate.entity.Booking;
import com.realestate.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    public Booking createBooking(Booking booking) {
        return bookingRepository.save(booking);
    }

    public Booking updateBooking(Long id, Booking updatedBooking) {
        return bookingRepository.findById(id)
                .map(booking -> {
                    booking.setUser(updatedBooking.getUser());
                    booking.setProperty(updatedBooking.getProperty());
                    booking.setVisitDate(updatedBooking.getVisitDate());
                    booking.setVisitTime(updatedBooking.getVisitTime());
                    booking.setStatus(updatedBooking.getStatus());
                    return bookingRepository.save(booking);
                })
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }
}
