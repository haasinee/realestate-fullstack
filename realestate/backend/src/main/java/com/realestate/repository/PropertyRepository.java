package com.realestate.repository;

import com.realestate.entity.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {

    List<Property> findByStatus(Property.Status status);

    List<Property> findByPropertyType(Property.PropertyType type);

    List<Property> findByIsFeaturedTrue();

    List<Property> findByCityIgnoreCase(String city);

    @Query("SELECT p FROM Property p WHERE " +
            "(:name = '' OR LOWER(p.propertyName) LIKE LOWER(CONCAT('%', :name, '%')) OR LOWER(p.title) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
            "(:location = '' OR LOWER(COALESCE(p.location, '')) LIKE LOWER(CONCAT('%', :location, '%')) OR LOWER(COALESCE(p.city, '')) LIKE LOWER(CONCAT('%', :location, '%')) OR LOWER(COALESCE(p.address, '')) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
            "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
            "p.status = 'ACTIVE'")
    List<Property> searchProperties(
            @Param("name") String name,
            @Param("location") String location,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice
    );

    @Query("SELECT p FROM Property p WHERE " +
            "(LOWER(p.propertyName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(COALESCE(p.location, '')) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(COALESCE(p.city, '')) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(COALESCE(p.address, '')) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
            "p.status = 'ACTIVE'")
    List<Property> findByKeyword(@Param("keyword") String keyword);

    long countByStatus(Property.Status status);
}
