package com.jobportal.service;

import com.jobportal.dto.PagedResponse;
import com.jobportal.dto.RecruiterDTO;
import com.jobportal.dto.UserDTO;
import com.jobportal.entity.Company;
import com.jobportal.entity.Recruiter;
import com.jobportal.entity.User;
import com.jobportal.enums.ApplicationStatus;
import com.jobportal.enums.JobStatus;
import com.jobportal.enums.Role;
import com.jobportal.enums.UserStatus;
import com.jobportal.exception.BadRequestException;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.CompanyRepository;
import com.jobportal.repository.InterviewRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.RecruiterRepository;
import com.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecruiterService {

    private final RecruiterRepository recruiterRepository;
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final InterviewRepository interviewRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public RecruiterDTO.RecruiterResponse getRecruiterProfile(User user) {
        Recruiter recruiter = recruiterRepository.findByUser(user)
                .orElseGet(() -> {
                    Recruiter newRec = Recruiter.builder().user(user).build();
                    return recruiterRepository.save(newRec);
                });
        return mapToResponse(recruiter);
    }

    @Transactional
    public RecruiterDTO.RecruiterResponse updateRecruiterProfile(User user, RecruiterDTO.RecruiterProfileRequest request) {
        Recruiter recruiter = recruiterRepository.findByUser(user)
                .orElseGet(() -> {
                    Recruiter newRec = Recruiter.builder().user(user).build();
                    return recruiterRepository.save(newRec);
                });

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        userRepository.save(user);

        if (request.getDesignation() != null) {
            recruiter.setDesignation(request.getDesignation());
        }

        recruiter = recruiterRepository.save(recruiter);
        return mapToResponse(recruiter);
    }

    @Transactional(readOnly = true)
    public PagedResponse<RecruiterDTO.RecruiterResponse> getRecruitersByCompany(Long companyId, int page, int size) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", companyId));

        Pageable pageable = PageRequest.of(page, size);
        Page<Recruiter> recruiterPage = recruiterRepository.findByCompany(company, pageable);

        List<RecruiterDTO.RecruiterResponse> content = recruiterPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return PagedResponse.of(
                content,
                recruiterPage.getNumber(),
                recruiterPage.getSize(),
                recruiterPage.getTotalElements(),
                recruiterPage.getTotalPages(),
                recruiterPage.isLast()
        );
    }

    @Transactional
    public RecruiterDTO.RecruiterResponse createRecruiter(RecruiterDTO.RecruiterCreateRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already in use: " + request.getEmail());
        }

        Company company = null;
        if (request.getCompanyId() != null) {
            company = companyRepository.findById(request.getCompanyId())
                    .orElseThrow(() -> new ResourceNotFoundException("Company", "id", request.getCompanyId()));
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(Role.RECRUITER)
                .status(UserStatus.ACTIVE)
                .build();
        user = userRepository.save(user);

        Recruiter recruiter = Recruiter.builder()
                .user(user)
                .company(company)
                .designation(request.getDesignation() != null ? request.getDesignation() : "Recruiter")
                .build();
        recruiter = recruiterRepository.save(recruiter);

        return mapToResponse(recruiter);
    }

    @Transactional(readOnly = true)
    public UserDTO.RecruiterDashboardStats getDashboardStats(User user) {
        Recruiter recruiter = recruiterRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found"));

        long activeJobs = jobRepository.findByRecruiter(recruiter, Pageable.unpaged())
                .getContent().stream()
                .filter(j -> j.getStatus() == JobStatus.OPEN)
                .count();

        long totalApps = applicationRepository.countByJobRecruiterId(recruiter.getId());
        long shortlisted = applicationRepository.countByJobRecruiterIdAndStatus(recruiter.getId(), ApplicationStatus.SHORTLISTED);
        long upcomingInterviews = interviewRepository.findUpcomingByRecruiter(recruiter.getId(), LocalDate.now()).size();

        return UserDTO.RecruiterDashboardStats.builder()
                .activeJobs(activeJobs)
                .totalApplications(totalApps)
                .shortlistedCandidates(shortlisted)
                .upcomingInterviews(upcomingInterviews)
                .build();
    }

    public RecruiterDTO.RecruiterResponse mapToResponse(Recruiter recruiter) {
        long jobCount = jobRepository.findByRecruiter(recruiter, Pageable.unpaged()).getTotalElements();

        return RecruiterDTO.RecruiterResponse.builder()
                .id(recruiter.getId())
                .userId(recruiter.getUser().getId())
                .name(recruiter.getUser().getName())
                .email(recruiter.getUser().getEmail())
                .phone(recruiter.getUser().getPhone())
                .companyId(recruiter.getCompany() != null ? recruiter.getCompany().getId() : null)
                .companyName(recruiter.getCompany() != null ? recruiter.getCompany().getName() : null)
                .companyLogo(recruiter.getCompany() != null ? recruiter.getCompany().getLogo() : null)
                .designation(recruiter.getDesignation())
                .postedJobsCount(jobCount)
                .createdAt(recruiter.getCreatedAt())
                .build();
    }
}
