package com.realestate.service;

import com.realestate.dto.AuthDTO;
import com.realestate.entity.User;
import com.realestate.repository.UserRepository;
import com.realestate.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private com.realestate.security.CustomUserDetailsService userDetailsService;

    public AuthDTO.AuthResponse login(AuthDTO.LoginRequest req) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );
        UserDetails userDetails = userDetailsService.loadUserByUsername(req.getEmail());
        String token = jwtUtil.generateToken(userDetails);
        User user = userRepository.findByEmail(req.getEmail()).orElseThrow();
        return new AuthDTO.AuthResponse(token, user.getEmail(),
                user.getFirstName(), user.getLastName(),
                user.getRole().name(), user.getId());
    }

    public AuthDTO.AuthResponse register(AuthDTO.RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        User user = User.builder()
                .firstName(req.getFirstName())
                .lastName(req.getLastName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .role(User.Role.USER)
                .build();
        userRepository.save(user);
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);
        return new AuthDTO.AuthResponse(token, user.getEmail(),
                user.getFirstName(), user.getLastName(),
                user.getRole().name(), user.getId());
    }
}
