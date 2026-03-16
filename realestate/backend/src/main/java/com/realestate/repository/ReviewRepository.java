package com.realestate.repository;

import com.realestate.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByPropertyId(Long propertyId);

    List<Review> findByUserId(Long userId);

    Optional<Review> findByPropertyIdAndUserId(Long propertyId, Long userId);

    boolean existsByPropertyIdAndUserId(Long propertyId, Long userId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.property.id = :propertyId")
    Double findAverageRatingByPropertyId(@Param("propertyId") Long propertyId);

    long countByPropertyId(Long propertyId);
}
