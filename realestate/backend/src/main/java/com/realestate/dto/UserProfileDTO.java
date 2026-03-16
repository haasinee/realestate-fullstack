package com.realestate.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class UserProfileDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String role;
    private LocalDateTime createdAt;
    private List<BookingDTO.Response> bookings;
    private List<ReviewDTO.Response> reviews;
}
