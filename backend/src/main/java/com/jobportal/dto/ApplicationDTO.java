package com.jobportal.dto;

import com.jobportal.enums.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

public class ApplicationDTO {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ApplicationRequest {
        @NotNull(message = "Job ID is required")
        private Long jobId;

        private Long resumeId;

        private String coverLetter;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ApplicationStatusUpdateRequest {
        @NotNull(message = "Status is required")
        private ApplicationStatus status;
        private String note;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ApplicationResponse {
        private Long id;
        private Long jobId;
        private String jobTitle;
        private String companyName;
        private String jobLocation;
        private Long candidateId;
        private Long userId;
        private String candidateName;
        private String candidateEmail;
        private String candidatePhone;
        private String candidateLocation;
        private String candidateExperience;
        private String candidateEducation;
        private Set<String> candidateSkills;
        private Long resumeId;
        private String resumeFileName;
        private String resumeFilePath;
        private String coverLetter;
        private ApplicationStatus status;
        private LocalDateTime appliedAt;
        private LocalDateTime updatedAt;
        private InterviewDTO.InterviewResponse interview;
    }
}
