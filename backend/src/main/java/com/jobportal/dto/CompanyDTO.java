package com.jobportal.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

public class CompanyDTO {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CompanyRequest {
        @NotBlank(message = "Company name is required")
        private String name;

        private String description;
        private String website;
        private String location;
        private String industry;
        private String logo;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CompanyResponse {
        private Long id;
        private String name;
        private String description;
        private String website;
        private String location;
        private String industry;
        private String logo;
        private long recruitersCount;
        private long openJobsCount;
        private LocalDateTime createdAt;
    }
}
