package com.jobportal.service;

import com.jobportal.dto.JobDTO;
import com.jobportal.dto.PagedResponse;
import com.jobportal.entity.*;
import com.jobportal.enums.EmploymentType;
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

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final RecruiterRepository recruiterRepository;
    private final CandidateRepository candidateRepository;
    private final ApplicationRepository applicationRepository;
    private final SkillRepository skillRepository;
    private final NotificationService notificationService;

    @Transactional(readOnly = true)
    public PagedResponse<JobDTO.JobResponse> searchJobs(
            String keyword,
            String location,
            EmploymentType employmentType,
            String experience,
            BigDecimal minSalary,
            JobStatus status,
            int page,
            int size,
            String sortBy,
            String sortDir,
            User currentUser
    ) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        // Normalize blank strings to null for query
        keyword = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;
        location = (location != null && !location.trim().isEmpty()) ? location.trim() : null;
        experience = (experience != null && !experience.trim().isEmpty()) ? experience.trim() : null;

        // Default public search to OPEN jobs if status not explicitly passed
        if (status == null) {
            status = JobStatus.OPEN;
        }

        Page<Job> jobPage = jobRepository.searchJobs(keyword, location, employmentType, experience, minSalary, status, pageable);

        Long currentCandidateId = null;
        if (currentUser != null && currentUser.getRole() == Role.CANDIDATE) {
            Candidate candidate = candidateRepository.findByUserId(currentUser.getId()).orElse(null);
            if (candidate != null) {
                currentCandidateId = candidate.getId();
            }
        }

        final Long finalCandId = currentCandidateId;
        List<JobDTO.JobResponse> content = jobPage.getContent().stream()
                .map(j -> mapToResponse(j, finalCandId))
                .collect(Collectors.toList());

        return PagedResponse.of(
                content,
                jobPage.getNumber(),
                jobPage.getSize(),
                jobPage.getTotalElements(),
                jobPage.getTotalPages(),
                jobPage.isLast()
        );
    }

    @Transactional(readOnly = true)
    public JobDTO.JobResponse getJobById(Long jobId, User currentUser) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        Long currentCandidateId = null;
        if (currentUser != null && currentUser.getRole() == Role.CANDIDATE) {
            Candidate candidate = candidateRepository.findByUserId(currentUser.getId()).orElse(null);
            if (candidate != null) {
                currentCandidateId = candidate.getId();
            }
        }

        return mapToResponse(job, currentCandidateId);
    }

    @Transactional
    public JobDTO.JobResponse createJob(User user, JobDTO.JobRequest request) {
        Recruiter recruiter = recruiterRepository.findByUser(user)
                .orElseThrow(() -> new BadRequestException("Recruiter profile not found. Please setup recruiter profile first."));

        Company company = recruiter.getCompany();
        if (company == null) {
            if (request.getCompanyId() != null) {
                company = companyRepository.findById(request.getCompanyId())
                        .orElseThrow(() -> new ResourceNotFoundException("Company", "id", request.getCompanyId()));
                recruiter.setCompany(company);
                recruiterRepository.save(recruiter);
            } else {
                throw new BadRequestException("Recruiter is not associated with any company. Please select or join a company.");
            }
        }

        Set<Skill> skillEntities = new HashSet<>();
        if (request.getSkills() != null) {
            for (String s : request.getSkills()) {
                String cleanName = s.trim();
                if (!cleanName.isEmpty()) {
                    Skill skill = skillRepository.findByNameIgnoreCase(cleanName)
                            .orElseGet(() -> skillRepository.save(new Skill(cleanName)));
                    skillEntities.add(skill);
                }
            }
        }

        Job job = Job.builder()
                .company(company)
                .recruiter(recruiter)
                .title(request.getTitle())
                .description(request.getDescription())
                .requirements(request.getRequirements())
                .location(request.getLocation())
                .employmentType(request.getEmploymentType())
                .experienceRequired(request.getExperienceRequired())
                .salaryMin(request.getSalaryMin())
                .salaryMax(request.getSalaryMax())
                .status(request.getStatus() != null ? request.getStatus() : JobStatus.OPEN)
                .deadline(request.getDeadline())
                .skills(skillEntities)
                .build();

        job = jobRepository.save(job);

        notificationService.sendNotification(
                user,
                "Job Posted Successfully",
                "Your job posting '" + job.getTitle() + "' is now live.",
                NotificationType.JOB_POSTED
        );

        return mapToResponse(job, null);
    }

    @Transactional
    public JobDTO.JobResponse updateJob(Long jobId, User user, JobDTO.JobRequest request) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        verifyJobOwnership(job, user);

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setRequirements(request.getRequirements());
        job.setLocation(request.getLocation());
        job.setEmploymentType(request.getEmploymentType());
        job.setExperienceRequired(request.getExperienceRequired());
        job.setSalaryMin(request.getSalaryMin());
        job.setSalaryMax(request.getSalaryMax());
        if (request.getStatus() != null) {
            job.setStatus(request.getStatus());
        }
        job.setDeadline(request.getDeadline());

        if (request.getSkills() != null) {
            Set<Skill> skillEntities = new HashSet<>();
            for (String s : request.getSkills()) {
                String cleanName = s.trim();
                if (!cleanName.isEmpty()) {
                    Skill skill = skillRepository.findByNameIgnoreCase(cleanName)
                            .orElseGet(() -> skillRepository.save(new Skill(cleanName)));
                    skillEntities.add(skill);
                }
            }
            job.setSkills(skillEntities);
        }

        job = jobRepository.save(job);
        return mapToResponse(job, null);
    }

    @Transactional
    public void deleteJob(Long jobId, User user) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        verifyJobOwnership(job, user);
        jobRepository.delete(job);
    }

    @Transactional(readOnly = true)
    public PagedResponse<JobDTO.JobResponse> getJobsByRecruiter(User user, int page, int size) {
        Recruiter recruiter = recruiterRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found"));

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Job> jobPage = jobRepository.findByRecruiter(recruiter, pageable);

        List<JobDTO.JobResponse> content = jobPage.getContent().stream()
                .map(j -> mapToResponse(j, null))
                .collect(Collectors.toList());

        return PagedResponse.of(
                content,
                jobPage.getNumber(),
                jobPage.getSize(),
                jobPage.getTotalElements(),
                jobPage.getTotalPages(),
                jobPage.isLast()
        );
    }

    @Transactional(readOnly = true)
    public PagedResponse<JobDTO.JobResponse> getJobsByCompany(Long companyId, int page, int size) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", companyId));

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Job> jobPage = jobRepository.findByCompany(company, pageable);

        List<JobDTO.JobResponse> content = jobPage.getContent().stream()
                .map(j -> mapToResponse(j, null))
                .collect(Collectors.toList());

        return PagedResponse.of(
                content,
                jobPage.getNumber(),
                jobPage.getSize(),
                jobPage.getTotalElements(),
                jobPage.getTotalPages(),
                jobPage.isLast()
        );
    }

    private void verifyJobOwnership(Job job, User user) {
        if (user.getRole() == Role.SYSTEM_ADMIN) {
            return;
        }

        if (user.getRole() == Role.RECRUITER) {
            Recruiter recruiter = recruiterRepository.findByUser(user).orElse(null);
            if (recruiter != null && job.getRecruiter().getId().equals(recruiter.getId())) {
                return;
            }
        }

        if (user.getRole() == Role.COMPANY_ADMIN) {
            Recruiter recruiter = recruiterRepository.findByUser(user).orElse(null);
            if (recruiter != null && recruiter.getCompany() != null && job.getCompany().getId().equals(recruiter.getCompany().getId())) {
                return;
            }
        }

        throw new UnauthorizedException("You are not authorized to manage this job posting");
    }

    public JobDTO.JobResponse mapToResponse(Job job, Long candidateId) {
        Set<String> skillNames = job.getSkills().stream()
                .map(Skill::getName)
                .collect(Collectors.toSet());

        boolean hasApplied = false;
        if (candidateId != null) {
            hasApplied = applicationRepository.existsByCandidateIdAndJobId(candidateId, job.getId());
        }

        return JobDTO.JobResponse.builder()
                .id(job.getId())
                .companyId(job.getCompany().getId())
                .companyName(job.getCompany().getName())
                .companyLocation(job.getCompany().getLocation())
                .companyLogo(job.getCompany().getLogo())
                .recruiterId(job.getRecruiter().getId())
                .recruiterName(job.getRecruiter().getUser().getName())
                .recruiterEmail(job.getRecruiter().getUser().getEmail())
                .title(job.getTitle())
                .description(job.getDescription())
                .requirements(job.getRequirements())
                .location(job.getLocation())
                .employmentType(job.getEmploymentType())
                .experienceRequired(job.getExperienceRequired())
                .salaryMin(job.getSalaryMin())
                .salaryMax(job.getSalaryMax())
                .status(job.getStatus())
                .deadline(job.getDeadline())
                .skills(skillNames)
                .applicationsCount(job.getApplications() != null ? job.getApplications().size() : 0)
                .hasApplied(hasApplied)
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .build();
    }
}
