package com.realestate.repository;

import com.realestate.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    List<Booking> findByPropertyId(Long propertyId);

    List<Booking> findByStatus(Booking.BookingStatus status);

    boolean existsByPropertyIdAndUserId(Long propertyId, Long userId);

    long countByStatus(Booking.BookingStatus status);
}
