package com.jobportal.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public class CandidateDTO {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CandidateProfileRequest {
        private String name;
        private String phone;
        private String profileSummary;
        private String location;
        private String experience;
        private String education;
        private Set<String> skills;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CandidateResponse {
        private Long id;
        private Long userId;
        private String name;
        private String email;
        private String phone;
        private String profileSummary;
        private String location;
        private String experience;
        private String education;
        private Set<String> skills;
        private List<ResumeResponse> resumes;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ResumeResponse {
        private Long id;
        private Long candidateId;
        private String fileName;
        private String filePath;
        private String fileType;
        private Long fileSize;
        private LocalDateTime uploadedAt;
    }
}
