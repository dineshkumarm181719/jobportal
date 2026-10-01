package com.jobportal.dto;

import com.jobportal.enums.EmploymentType;
import com.jobportal.enums.JobStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

public class JobDTO {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class JobRequest {
        @NotBlank(message = "Job title is required")
        private String title;

        @NotBlank(message = "Job description is required")
        private String description;

        private String requirements;

        @NotBlank(message = "Location is required")
        private String location;

        @NotNull(message = "Employment type is required")
        private EmploymentType employmentType;

        private String experienceRequired;

        private BigDecimal salaryMin;

        private BigDecimal salaryMax;

        private JobStatus status;

        private LocalDate deadline;

        private Set<String> skills;

        private Long companyId; // optional override for Company Admin / System Admin
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class JobResponse {
        private Long id;
        private Long companyId;
        private String companyName;
        private String companyLocation;
        private String companyLogo;
        private Long recruiterId;
        private String recruiterName;
        private String recruiterEmail;
        private String title;
        private String description;
        private String requirements;
        private String location;
        private EmploymentType employmentType;
        private String experienceRequired;
        private BigDecimal salaryMin;
        private BigDecimal salaryMax;
        private JobStatus status;
        private LocalDate deadline;
        private Set<String> skills;
        private long applicationsCount;
        private Boolean hasApplied;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}
