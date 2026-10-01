package com.jobportal.dto;

import com.jobportal.enums.Role;
import com.jobportal.enums.UserStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

public class UserDTO {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserResponse {
        private Long id;
        private String name;
        private String email;
        private String phone;
        private Role role;
        private UserStatus status;
        private LocalDateTime createdAt;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserStatusUpdateRequest {
        @NotNull(message = "Status is required")
        private UserStatus status;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AdminDashboardStats {
        private long totalUsers;
        private long totalCandidates;
        private long totalRecruiters;
        private long totalCompanies;
        private long totalJobs;
        private long totalApplications;
        private long activeJobs;
        private long activeUsers;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RecruiterDashboardStats {
        private long activeJobs;
        private long totalApplications;
        private long shortlistedCandidates;
        private long upcomingInterviews;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CandidateDashboardStats {
        private long totalApplications;
        private long shortlistedApplications;
        private long scheduledInterviews;
        private long savedJobs;
    }
}
