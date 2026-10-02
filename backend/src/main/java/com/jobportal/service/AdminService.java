package com.jobportal.service;

import com.jobportal.dto.PagedResponse;
import com.jobportal.dto.UserDTO;
import com.jobportal.entity.Candidate;
import com.jobportal.entity.User;
import com.jobportal.enums.ApplicationStatus;
import com.jobportal.enums.JobStatus;
import com.jobportal.enums.Role;
import com.jobportal.enums.UserStatus;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobportal.entity.Company;
import com.jobportal.entity.Recruiter;
import com.jobportal.exception.BadRequestException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final CandidateRepository candidateRepository;
    private final RecruiterRepository recruiterRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public UserDTO.AdminDashboardStats getAdminStats() {
        long totalUsers = userRepository.count();
        long totalCandidates = userRepository.countByRole(Role.CANDIDATE);
        long totalRecruiters = userRepository.countByRole(Role.RECRUITER);
        long totalCompanies = companyRepository.count();
        long totalJobs = jobRepository.count();
        long totalApplications = applicationRepository.count();
        long activeJobs = jobRepository.countByStatus(JobStatus.OPEN);
        long activeUsers = userRepository.countByStatus(UserStatus.ACTIVE);

        return UserDTO.AdminDashboardStats.builder()
                .totalUsers(totalUsers)
                .totalCandidates(totalCandidates)
                .totalRecruiters(totalRecruiters)
                .totalCompanies(totalCompanies)
                .totalJobs(totalJobs)
                .totalApplications(totalApplications)
                .activeJobs(activeJobs)
                .activeUsers(activeUsers)
                .build();
    }

    @Transactional(readOnly = true)
    public UserDTO.CandidateDashboardStats getCandidateDashboardStats(User user) {
        Candidate candidate = candidateRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));

        long totalApps = applicationRepository.countByCandidate(candidate);
        long shortlisted = applicationRepository.countByCandidateAndStatus(candidate, ApplicationStatus.SHORTLISTED);
        long interviews = applicationRepository.countByCandidateAndStatus(candidate, ApplicationStatus.INTERVIEW_SCHEDULED);

        return UserDTO.CandidateDashboardStats.builder()
                .totalApplications(totalApps)
                .shortlistedApplications(shortlisted)
                .scheduledInterviews(interviews)
                .savedJobs(0)
                .build();
    }

    @Transactional(readOnly = true)
    public PagedResponse<UserDTO.UserResponse> getAllUsers(Role role, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<User> userPage;

        if (role != null) {
            userPage = userRepository.findByRole(role, pageable);
        } else {
            userPage = userRepository.findAll(pageable);
        }

        List<UserDTO.UserResponse> content = userPage.getContent().stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());

        return PagedResponse.of(
                content,
                userPage.getNumber(),
                userPage.getSize(),
                userPage.getTotalElements(),
                userPage.getTotalPages(),
                userPage.isLast()
        );
    }

    @Transactional
    public UserDTO.UserResponse updateUserStatus(Long userId, UserDTO.UserStatusUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        user.setStatus(request.getStatus());
        user = userRepository.save(user);

        return mapToUserResponse(user);
    }

    @Transactional
    public UserDTO.UserResponse createUser(UserDTO.CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered: " + request.getEmail());
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(request.getRole())
                .status(UserStatus.ACTIVE)
                .build();

        user = userRepository.save(user);

        if (request.getRole() == Role.CANDIDATE) {
            Candidate candidate = Candidate.builder()
                    .user(user)
                    .build();
            candidateRepository.save(candidate);
        } else if (request.getRole() == Role.RECRUITER || request.getRole() == Role.COMPANY_ADMIN) {
            Company company = null;
            if (request.getCompanyId() != null) {
                company = companyRepository.findById(request.getCompanyId()).orElse(null);
            }
            if (company == null) {
                List<Company> companies = companyRepository.findAll();
                if (!companies.isEmpty()) {
                    company = companies.get(0);
                }
            }

            String designation = request.getDesignation();
            if (designation == null || designation.trim().isEmpty()) {
                designation = request.getRole() == Role.COMPANY_ADMIN ? "Company Administrator" : "Corporate Recruiter";
            }

            Recruiter recruiter = Recruiter.builder()
                    .user(user)
                    .company(company)
                    .designation(designation)
                    .build();
            recruiterRepository.save(recruiter);
        }

        return mapToUserResponse(user);
    }

    private UserDTO.UserResponse mapToUserResponse(User user) {
        return UserDTO.UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
