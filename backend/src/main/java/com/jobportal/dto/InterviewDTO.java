package com.jobportal.dto;

import com.jobportal.enums.InterviewMode;
import com.jobportal.enums.InterviewStatus;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class InterviewDTO {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class InterviewRequest {
        @NotNull(message = "Application ID is required")
        private Long applicationId;

        @NotNull(message = "Interview date is required")
        @FutureOrPresent(message = "Interview date cannot be in the past")
        private LocalDate interviewDate;

        @NotBlank(message = "Interview time is required")
        private String interviewTime;

        @NotNull(message = "Interview mode is required")
        private InterviewMode interviewMode;

        private String meetingLink;

        private String location;

        private String notes;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class InterviewStatusUpdateRequest {
        @NotNull(message = "Status is required")
        private InterviewStatus status;
        private String notes;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class InterviewResponse {
        private Long id;
        private Long applicationId;
        private Long jobId;
        private String jobTitle;
        private String companyName;
        private Long candidateId;
        private String candidateName;
        private String candidateEmail;
        private Long recruiterId;
        private String recruiterName;
        private LocalDate interviewDate;
        private String interviewTime;
        private InterviewMode interviewMode;
        private String meetingLink;
        private String location;
        private InterviewStatus status;
        private String notes;
        private LocalDateTime createdAt;
    }
}
