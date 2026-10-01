package com.jobportal.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

public class RecruiterDTO {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RecruiterProfileRequest {
        private String name;
        private String phone;
        private String designation;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RecruiterCreateRequest {
        @NotBlank(message = "Name is required")
        private String name;

        @NotBlank(message = "Email is required")
        @Email(message = "Valid email is required")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;

        private String phone;
        private String designation;
        private Long companyId;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RecruiterResponse {
        private Long id;
        private Long userId;
        private String name;
        private String email;
        private String phone;
        private Long companyId;
        private String companyName;
        private String companyLogo;
        private String designation;
        private long postedJobsCount;
        private LocalDateTime createdAt;
    }
}
