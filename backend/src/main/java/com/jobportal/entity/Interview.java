package com.jobportal.entity;

import com.jobportal.enums.InterviewMode;
import com.jobportal.enums.InterviewStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "interviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recruiter_id", nullable = false)
    private Recruiter recruiter;

    @Column(name = "interview_date", nullable = false)
    private LocalDate interviewDate;

    @Column(name = "interview_time", nullable = false, length = 20)
    private String interviewTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "interview_mode", nullable = false, length = 20)
    private InterviewMode interviewMode;

    @Column(name = "meeting_link", length = 500)
    private String meetingLink;

    @Column(length = 255)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private InterviewStatus status = InterviewStatus.SCHEDULED;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = InterviewStatus.SCHEDULED;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
