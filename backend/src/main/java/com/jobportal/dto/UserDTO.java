package com.jobportal.dto;

import com.jobportal.enums.Role;
import com.jobportal.enums.UserStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateUserRequest {
        @NotBlank(message = "Name is required")
        private String name;

        @NotBlank(message = "Email is required")
        @Email(message = "Valid email is required")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;

        private String phone;

        @NotNull(message = "Role is required")
        private Role role;

        private Long companyId;
        private String designation;
    }
}
