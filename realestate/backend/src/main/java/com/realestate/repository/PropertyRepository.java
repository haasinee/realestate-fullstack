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

    List<Property> findByIsFeaturedTrue();

    @Query("SELECT p FROM Property p WHERE " +
            "(:name IS NULL OR TRIM(:name) = '' OR LOWER(COALESCE(p.propertyName, p.title, '')) LIKE LOWER(CONCAT('%', TRIM(:name), '%')) OR LOWER(COALESCE(p.title, '')) LIKE LOWER(CONCAT('%', TRIM(:name), '%'))) AND " +
            "(:location IS NULL OR TRIM(:location) = '' OR LOWER(COALESCE(p.location, '')) LIKE LOWER(CONCAT('%', TRIM(:location), '%')) OR LOWER(COALESCE(p.city, '')) LIKE LOWER(CONCAT('%', TRIM(:location), '%')) OR LOWER(COALESCE(p.address, '')) LIKE LOWER(CONCAT('%', TRIM(:location), '%'))) AND " +
            "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
            "(:propertyType IS NULL OR p.propertyType = :propertyType) AND " +
            "p.status = :status")
    List<Property> searchProperties(
            @Param("name") String name,
            @Param("location") String location,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("propertyType") Property.PropertyType propertyType,
            @Param("status") Property.Status status
    );

    @Query("SELECT p FROM Property p WHERE " +
            "(LOWER(COALESCE(p.propertyName, p.title, '')) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(COALESCE(p.title, '')) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(COALESCE(p.location, '')) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(COALESCE(p.city, '')) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(COALESCE(p.address, '')) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
            "p.status = :status")
    List<Property> findByKeyword(@Param("keyword") String keyword, @Param("status") Property.Status status);

    long countByStatus(Property.Status status);
}
