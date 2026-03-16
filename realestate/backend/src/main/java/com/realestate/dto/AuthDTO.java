package com.realestate.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

public class AuthDTO {

    @Data
    public static class LoginRequest {
        @NotBlank @Email
        private String email;
        @NotBlank
        private String password;
    }

    @Data
    public static class RegisterRequest {
        @NotBlank @Size(min=2, max=50)
        private String firstName;
        @NotBlank @Size(min=2, max=50)
        private String lastName;
        @NotBlank @Email
        private String email;
        @NotBlank @Size(min=6)
        private String password;
        private String phone;
    }

    @Data
    public static class AuthResponse {
        private String token;
        private String email;
        private String firstName;
        private String lastName;
        private String role;
        private Long userId;

        public AuthResponse(String token, String email, String firstName,
                            String lastName, String role, Long userId) {
            this.token = token;
            this.email = email;
            this.firstName = firstName;
            this.lastName = lastName;
            this.role = role;
            this.userId = userId;
        }
    }
}
