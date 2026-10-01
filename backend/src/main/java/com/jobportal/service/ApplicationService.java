package com.jobportal.service;

import com.jobportal.dto.ApplicationDTO;
import com.jobportal.dto.InterviewDTO;
import com.jobportal.dto.PagedResponse;
import com.jobportal.entity.*;
import com.jobportal.enums.ApplicationStatus;
import com.jobportal.enums.JobStatus;
import com.jobportal.enums.NotificationType;
import com.jobportal.enums.Role;
import com.jobportal.exception.BadRequestException;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.exception.UnauthorizedException;
import com.jobportal.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final CandidateRepository candidateRepository;
    private final RecruiterRepository recruiterRepository;
    private final ResumeRepository resumeRepository;
    private final InterviewRepository interviewRepository;
    private final NotificationService notificationService;

    @Transactional
    public ApplicationDTO.ApplicationResponse applyForJob(User user, ApplicationDTO.ApplicationRequest request) {
        Candidate candidate = candidateRepository.findByUser(user)
                .orElseThrow(() -> new BadRequestException("Candidate profile not found. Please complete your profile before applying."));

        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", request.getJobId()));

        if (job.getStatus() != JobStatus.OPEN) {
            throw new BadRequestException("This job posting is no longer accepting applications.");
        }

        if (applicationRepository.existsByCandidateIdAndJobId(candidate.getId(), job.getId())) {
            throw new BadRequestException("You have already submitted an application for this position.");
        }

        Resume resume = null;
        if (request.getResumeId() != null) {
            resume = resumeRepository.findById(request.getResumeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Resume", "id", request.getResumeId()));
        } else {
            List<Resume> candidateResumes = resumeRepository.findByCandidateOrderByUploadedAtDesc(candidate);
            if (!candidateResumes.isEmpty()) {
                resume = candidateResumes.get(0);
            }
        }

        Application application = Application.builder()
                .candidate(candidate)
                .job(job)
                .resume(resume)
                .coverLetter(request.getCoverLetter())
                .status(ApplicationStatus.APPLIED)
                .build();

        application = applicationRepository.save(application);

        // Notify Candidate
        notificationService.sendNotification(
                user,
                "Application Submitted Successfully",
                "Your application for '" + job.getTitle() + "' at " + job.getCompany().getName() + " has been received.",
                NotificationType.APPLICATION_SUBMITTED
        );

        // Notify Recruiter
        if (job.getRecruiter() != null && job.getRecruiter().getUser() != null) {
            notificationService.sendNotification(
                    job.getRecruiter().getUser(),
                    "New Application Received",
                    candidate.getUser().getName() + " has applied for '" + job.getTitle() + "'.",
                    NotificationType.APPLICATION_SUBMITTED
            );
        }

        return mapToResponse(application);
    }

    @Transactional(readOnly = true)
    public PagedResponse<ApplicationDTO.ApplicationResponse> getCandidateApplications(User user, int page, int size) {
        Candidate candidate = candidateRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));

        Pageable pageable = PageRequest.of(page, size, Sort.by("appliedAt").descending());
        Page<Application> appPage = applicationRepository.findByCandidate(candidate, pageable);

        List<ApplicationDTO.ApplicationResponse> content = appPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return PagedResponse.of(
                content,
                appPage.getNumber(),
                appPage.getSize(),
                appPage.getTotalElements(),
                appPage.getTotalPages(),
                appPage.isLast()
        );
    }

    @Transactional(readOnly = true)
    public PagedResponse<ApplicationDTO.ApplicationResponse> getRecruiterApplications(User user, Long jobId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("appliedAt").descending());
        Page<Application> appPage;

        if (user.getRole() == Role.SYSTEM_ADMIN) {
            if (jobId != null) {
                appPage = applicationRepository.findByJobId(jobId, pageable);
            } else {
                appPage = applicationRepository.findAll(pageable);
            }
        } else if (user.getRole() == Role.COMPANY_ADMIN) {
            Recruiter recruiter = recruiterRepository.findByUser(user).orElse(null);
            if (recruiter == null || recruiter.getCompany() == null) {
                throw new BadRequestException("Company admin profile not linked to a company.");
            }
            if (jobId != null) {
                appPage = applicationRepository.findByJobId(jobId, pageable);
            } else {
                appPage = applicationRepository.findByCompanyId(recruiter.getCompany().getId(), pageable);
            }
        } else {
            Recruiter recruiter = recruiterRepository.findByUser(user)
                    .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found"));
            if (jobId != null) {
                appPage = applicationRepository.findByJobId(jobId, pageable);
            } else {
                appPage = applicationRepository.findByRecruiterId(recruiter.getId(), pageable);
            }
        }

        List<ApplicationDTO.ApplicationResponse> content = appPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return PagedResponse.of(
                content,
                appPage.getNumber(),
                appPage.getSize(),
                appPage.getTotalElements(),
                appPage.getTotalPages(),
                appPage.isLast()
        );
    }

    @Transactional(readOnly = true)
    public ApplicationDTO.ApplicationResponse getApplicationById(Long applicationId, User user) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));

        // Authorization check
        if (user.getRole() == Role.CANDIDATE) {
            if (!application.getCandidate().getUser().getId().equals(user.getId())) {
                throw new UnauthorizedException("You are not authorized to view this application.");
            }
        } else if (user.getRole() == Role.RECRUITER) {
            Recruiter recruiter = recruiterRepository.findByUser(user).orElse(null);
            if (recruiter != null && !application.getJob().getRecruiter().getId().equals(recruiter.getId())) {
                throw new UnauthorizedException("You do not own this job application.");
            }
        }

        return mapToResponse(application);
    }

    @Transactional
    public ApplicationDTO.ApplicationResponse updateApplicationStatus(Long applicationId, User user, ApplicationDTO.ApplicationStatusUpdateRequest request) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));

        // Candidate can only WITHDRAW their own application
        if (user.getRole() == Role.CANDIDATE) {
            if (!application.getCandidate().getUser().getId().equals(user.getId())) {
                throw new UnauthorizedException("Unauthorized");
            }
            if (request.getStatus() != ApplicationStatus.WITHDRAWN) {
                throw new BadRequestException("Candidates can only withdraw their applications.");
            }
        } else {
            // Recruiter/Company Admin/System Admin check
            if (user.getRole() == Role.RECRUITER) {
                Recruiter recruiter = recruiterRepository.findByUser(user).orElse(null);
                if (recruiter != null && !application.getJob().getRecruiter().getId().equals(recruiter.getId())) {
                    throw new UnauthorizedException("You do not manage this job's applications.");
                }
            }
        }

        application.setStatus(request.getStatus());
        application = applicationRepository.save(application);

        // Send corresponding notification to candidate
        String jobTitle = application.getJob().getTitle();
        String companyName = application.getJob().getCompany().getName();
        User candidateUser = application.getCandidate().getUser();

        if (request.getStatus() == ApplicationStatus.SHORTLISTED) {
            notificationService.sendNotification(
                    candidateUser,
                    "Application Shortlisted 🎉",
                    "Congratulations! Your application for '" + jobTitle + "' at " + companyName + " has been shortlisted.",
                    NotificationType.CANDIDATE_SHORTLISTED
            );
        } else if (request.getStatus() == ApplicationStatus.REJECTED) {
            notificationService.sendNotification(
                    candidateUser,
                    "Application Update",
                    "Thank you for applying to '" + jobTitle + "' at " + companyName + ". The recruiter has updated your status.",
                    NotificationType.CANDIDATE_REJECTED
            );
        } else if (request.getStatus() == ApplicationStatus.SELECTED) {
            notificationService.sendNotification(
                    candidateUser,
                    "Congratulations! Offer Extended 🎊",
                    "You have been selected for the '" + jobTitle + "' position at " + companyName + "!",
                    NotificationType.APPLICATION_STATUS_CHANGED
            );
        }

        return mapToResponse(application);
    }

    public ApplicationDTO.ApplicationResponse mapToResponse(Application application) {
        Candidate candidate = application.getCandidate();
        Job job = application.getJob();
        Resume resume = application.getResume();

        Set<String> skills = candidate.getSkills() != null
                ? candidate.getSkills().stream().map(Skill::getName).collect(Collectors.toSet())
                : Set.of();

        InterviewDTO.InterviewResponse interviewResponse = null;
        Interview interview = interviewRepository.findByApplicationId(application.getId()).orElse(null);
        if (interview != null) {
            interviewResponse = InterviewDTO.InterviewResponse.builder()
                    .id(interview.getId())
                    .applicationId(application.getId())
                    .jobId(job.getId())
                    .jobTitle(job.getTitle())
                    .companyName(job.getCompany().getName())
                    .candidateId(candidate.getId())
                    .candidateName(candidate.getUser().getName())
                    .candidateEmail(candidate.getUser().getEmail())
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

        return ApplicationDTO.ApplicationResponse.builder()
                .id(application.getId())
                .jobId(job.getId())
                .jobTitle(job.getTitle())
                .companyName(job.getCompany().getName())
                .jobLocation(job.getLocation())
                .candidateId(candidate.getId())
                .userId(candidate.getUser().getId())
                .candidateName(candidate.getUser().getName())
                .candidateEmail(candidate.getUser().getEmail())
                .candidatePhone(candidate.getUser().getPhone())
                .candidateLocation(candidate.getLocation())
                .candidateExperience(candidate.getExperience())
                .candidateEducation(candidate.getEducation())
                .candidateSkills(skills)
                .resumeId(resume != null ? resume.getId() : null)
                .resumeFileName(resume != null ? resume.getFileName() : null)
                .resumeFilePath(resume != null ? resume.getFilePath() : null)
                .coverLetter(application.getCoverLetter())
                .status(application.getStatus())
                .appliedAt(application.getAppliedAt())
                .updatedAt(application.getUpdatedAt())
                .interview(interviewResponse)
                .build();
    }
}
