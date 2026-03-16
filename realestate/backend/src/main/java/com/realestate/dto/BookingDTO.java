package com.realestate.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class BookingDTO {

    @Data
    public static class CreateRequest {
        @NotNull
        private Long propertyId;
        @NotNull
        private LocalDate visitDate;
        @NotNull
        private LocalTime visitTime;
        @NotBlank
        private String visitorName;
        @NotBlank
        private String visitorPhone;
        private String notes;
    }

    @Data
    public static class Response {
        private Long id;
        private Long propertyId;
        private String propertyTitle;
        private String propertyCity;
        private Long userId;
        private String userName;
        private LocalDate visitDate;
        private LocalTime visitTime;
        private String visitorName;
        private String visitorPhone;
        private String status;
        private String notes;
        private LocalDateTime createdAt;
    }

    @Data
    public static class StatusUpdate {
        @NotBlank
        private String status;
    }
}
