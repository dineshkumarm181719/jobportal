package com.jobportal.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
public class RootController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> root() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "UP");
        response.put("message", "Job Portal REST API is running successfully!");
        
        Map<String, String> endpoints = new LinkedHashMap<>();
        endpoints.put("jobs", "/api/jobs");
        endpoints.put("companies", "/api/companies");
        endpoints.put("login", "/api/auth/login");
        endpoints.put("register", "/api/auth/register");
        endpoints.put("h2Console", "/h2-console");
        
        response.put("endpoints", endpoints);
        return ResponseEntity.ok(response);
    }
}
