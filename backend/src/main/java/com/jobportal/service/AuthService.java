package com.jobportal.service;

import com.jobportal.dto.AuthDTO;
import com.jobportal.entity.Candidate;
import com.jobportal.entity.Recruiter;
import com.jobportal.entity.User;
import com.jobportal.enums.NotificationType;
import com.jobportal.enums.Role;
import com.jobportal.enums.UserStatus;
import com.jobportal.exception.BadRequestException;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.repository.CandidateRepository;
import com.jobportal.repository.RecruiterRepository;
import com.jobportal.repository.UserRepository;
import com.jobportal.security.JwtService;
import com.jobportal.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final CandidateRepository candidateRepository;
    private final RecruiterRepository recruiterRepository;
    private final com.jobportal.repository.CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final NotificationService notificationService;

    @Transactional
    public AuthDTO.AuthResponse register(AuthDTO.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email address is already registered: " + request.getEmail());
        }

        // Support CANDIDATE, RECRUITER, or COMPANY_ADMIN
        Role role = request.getRole();
        if (role == null || (role != Role.CANDIDATE && role != Role.RECRUITER && role != Role.COMPANY_ADMIN)) {
            role = Role.CANDIDATE;
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(role)
                .status(UserStatus.ACTIVE)
                .build();

        user = userRepository.save(user);

        Long candidateId = null;
        Long recruiterId = null;
        Long companyId = null;
        String companyName = null;

        if (role == Role.CANDIDATE) {
            Candidate candidate = Candidate.builder()
                    .user(user)
                    .build();
            candidate = candidateRepository.save(candidate);
            candidateId = candidate.getId();
        } else if (role == Role.RECRUITER) {
            Recruiter recruiter = Recruiter.builder()
                    .user(user)
                    .designation("Talent Acquisition Specialist")
                    .build();
            recruiter = recruiterRepository.save(recruiter);
            recruiterId = recruiter.getId();
        } else if (role == Role.COMPANY_ADMIN) {
            String compName = request.getCompanyName();
            if (compName == null || compName.trim().isEmpty()) {
                compName = user.getName() + "'s Organization";
            }
            com.jobportal.entity.Company company = com.jobportal.entity.Company.builder()
                    .name(compName.trim())
                    .industry(request.getCompanyIndustry() != null ? request.getCompanyIndustry() : "Technology")
                    .location(request.getCompanyLocation() != null ? request.getCompanyLocation() : "Remote")
                    .website(request.getCompanyWebsite())
                    .description("Corporate organization managed by " + user.getName())
                    .build();
            company = companyRepository.save(company);
            companyId = company.getId();
            companyName = company.getName();

            Recruiter recruiter = Recruiter.builder()
                    .user(user)
                    .company(company)
                    .designation("Company Administrator")
                    .build();
            recruiter = recruiterRepository.save(recruiter);
            recruiterId = recruiter.getId();
        }

        notificationService.sendNotification(
                user,
                "Welcome to CareerSync!",
                "Your account has been successfully created. Explore open job positions or build your profile.",
                NotificationType.SYSTEM_ALERT
        );

        String token = jwtService.generateTokenFromEmail(user.getEmail(), user.getId(), user.getName(), user.getRole().name());

        return AuthDTO.AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .phone(user.getPhone())
                .candidateId(candidateId)
                .recruiterId(recruiterId)
                .companyId(companyId)
                .companyName(companyName)
                .build();
    }

    @Transactional(readOnly = true)
    public AuthDTO.AuthResponse login(AuthDTO.LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().toLowerCase().trim(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtService.generateToken(authentication);

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));

        Long candidateId = null;
        Long recruiterId = null;
        Long companyId = null;
        String companyName = null;

        if (user.getRole() == Role.CANDIDATE) {
            Candidate candidate = candidateRepository.findByUserId(user.getId()).orElse(null);
            if (candidate != null) {
                candidateId = candidate.getId();
            }
        } else if (user.getRole() == Role.RECRUITER || user.getRole() == Role.COMPANY_ADMIN) {
            Recruiter recruiter = recruiterRepository.findByUserId(user.getId()).orElse(null);
            if (recruiter != null) {
                recruiterId = recruiter.getId();
                if (recruiter.getCompany() != null) {
                    companyId = recruiter.getCompany().getId();
                    companyName = recruiter.getCompany().getName();
                }
            }
        }

        return AuthDTO.AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .phone(user.getPhone())
                .candidateId(candidateId)
                .recruiterId(recruiterId)
                .companyId(companyId)
                .companyName(companyName)
                .build();
    }

    @Transactional
    public void resetPassword(AuthDTO.ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new BadRequestException("Current password does not match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        notificationService.sendNotification(
                user,
                "Password Changed Successfully",
                "Your account password was recently updated. If you did not make this change, please contact support immediately.",
                NotificationType.SYSTEM_ALERT
        );
    }
}
