package com.jobportal.service;

import com.jobportal.dto.InterviewDTO;
import com.jobportal.dto.PagedResponse;
import com.jobportal.entity.*;
import com.jobportal.enums.ApplicationStatus;
import com.jobportal.enums.InterviewStatus;
import com.jobportal.enums.NotificationType;
import com.jobportal.enums.Role;
import com.jobportal.exception.BadRequestException;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.exception.UnauthorizedException;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.CandidateRepository;
import com.jobportal.repository.InterviewRepository;
import com.jobportal.repository.RecruiterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final ApplicationRepository applicationRepository;
    private final RecruiterRepository recruiterRepository;
    private final CandidateRepository candidateRepository;
    private final NotificationService notificationService;

    @Transactional
    public InterviewDTO.InterviewResponse scheduleInterview(User user, InterviewDTO.InterviewRequest request) {
        Recruiter recruiter = recruiterRepository.findByUser(user)
                .orElseThrow(() -> new BadRequestException("Recruiter profile not found"));

        Application application = applicationRepository.findById(request.getApplicationId())
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", request.getApplicationId()));

        if (user.getRole() == Role.RECRUITER && !application.getJob().getRecruiter().getId().equals(recruiter.getId())) {
            throw new UnauthorizedException("You are not authorized to schedule an interview for this application.");
        }

        // Check if an interview already exists for this application
        Interview interview = interviewRepository.findByApplicationId(application.getId())
                .orElse(Interview.builder().application(application).recruiter(recruiter).build());

        interview.setInterviewDate(request.getInterviewDate());
        interview.setInterviewTime(request.getInterviewTime());
        interview.setInterviewMode(request.getInterviewMode());
        interview.setMeetingLink(request.getMeetingLink());
        interview.setLocation(request.getLocation());
        interview.setStatus(InterviewStatus.SCHEDULED);
        interview.setNotes(request.getNotes());
        interview.setRecruiter(recruiter);

        interview = interviewRepository.save(interview);

        // Update application status to INTERVIEW_SCHEDULED
        application.setStatus(ApplicationStatus.INTERVIEW_SCHEDULED);
        applicationRepository.save(application);

        // Notify Candidate
        String modeDetails = request.getMeetingLink() != null && !request.getMeetingLink().isBlank()
                ? "Meeting Link: " + request.getMeetingLink()
                : (request.getLocation() != null ? "Location: " + request.getLocation() : "");

        notificationService.sendNotification(
                application.getCandidate().getUser(),
                "Interview Scheduled 📅",
                "Your interview for '" + application.getJob().getTitle() + "' is scheduled on " +
                        request.getInterviewDate() + " at " + request.getInterviewTime() + ". " + modeDetails,
                NotificationType.INTERVIEW_SCHEDULED
        );

        return mapToResponse(interview);
    }

    @Transactional
    public InterviewDTO.InterviewResponse updateInterviewStatus(Long interviewId, User user, InterviewDTO.InterviewStatusUpdateRequest request) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview", "id", interviewId));

        interview.setStatus(request.getStatus());
        if (request.getNotes() != null) {
            interview.setNotes(request.getNotes());
        }

        interview = interviewRepository.save(interview);

        if (request.getStatus() == InterviewStatus.CANCELLED) {
            notificationService.sendNotification(
                    interview.getApplication().getCandidate().getUser(),
                    "Interview Cancelled",
                    "Your interview for '" + interview.getApplication().getJob().getTitle() + "' scheduled on " +
                            interview.getInterviewDate() + " has been cancelled.",
                    NotificationType.INTERVIEW_CANCELLED
            );
        }

        return mapToResponse(interview);
    }

    @Transactional(readOnly = true)
    public PagedResponse<InterviewDTO.InterviewResponse> getInterviewsForUser(User user, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("interviewDate").ascending());
        Page<Interview> interviewPage;

        if (user.getRole() == Role.CANDIDATE) {
            Candidate candidate = candidateRepository.findByUser(user)
                    .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));
            interviewPage = interviewRepository.findByCandidate(candidate, pageable);
        } else if (user.getRole() == Role.RECRUITER) {
            Recruiter recruiter = recruiterRepository.findByUser(user)
                    .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found"));
            interviewPage = interviewRepository.findByRecruiter(recruiter, pageable);
        } else {
            interviewPage = interviewRepository.findAll(pageable);
        }

        List<InterviewDTO.InterviewResponse> content = interviewPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return PagedResponse.of(
                content,
                interviewPage.getNumber(),
                interviewPage.getSize(),
                interviewPage.getTotalElements(),
                interviewPage.getTotalPages(),
                interviewPage.isLast()
        );
    }

    @Transactional(readOnly = true)
    public List<InterviewDTO.InterviewResponse> getUpcomingInterviews(User user) {
        LocalDate today = LocalDate.now();
        List<Interview> list;
        if (user.getRole() == Role.CANDIDATE) {
            Candidate candidate = candidateRepository.findByUser(user).orElse(null);
            if (candidate == null) return List.of();
            list = interviewRepository.findUpcomingByCandidate(candidate.getId(), today);
        } else if (user.getRole() == Role.RECRUITER) {
            Recruiter recruiter = recruiterRepository.findByUser(user).orElse(null);
            if (recruiter == null) return List.of();
            list = interviewRepository.findUpcomingByRecruiter(recruiter.getId(), today);
        } else {
            list = List.of();
        }

        return list.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public InterviewDTO.InterviewResponse mapToResponse(Interview interview) {
        return InterviewDTO.InterviewResponse.builder()
                .id(interview.getId())
                .applicationId(interview.getApplication().getId())
                .jobId(interview.getApplication().getJob().getId())
                .jobTitle(interview.getApplication().getJob().getTitle())
                .companyName(interview.getApplication().getJob().getCompany().getName())
                .candidateId(interview.getApplication().getCandidate().getId())
                .candidateName(interview.getApplication().getCandidate().getUser().getName())
                .candidateEmail(interview.getApplication().getCandidate().getUser().getEmail())
                .recruiterId(interview.getRecruiter().getId())
                .recruiterName(interview.getRecruiter().getUser().getName())
                .interviewDate(interview.getInterviewDate())
                .interviewTime(interview.getInterviewTime())
                .interviewMode(interview.getInterviewMode())
                .meetingLink(interview.getMeetingLink())
                .location(interview.getLocation())
                .status(interview.getStatus())
                .notes(interview.getNotes())
                .createdAt(interview.getCreatedAt())
                .build();
    }
}
