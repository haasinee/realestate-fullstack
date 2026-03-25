package com.realestate.realestatebackend.service;

import org.springframework.stereotype.Service;

@Service
public class HealthService {

    public String getHealthStatus() {
        return "Real Estate Backend is running";
    }
}
