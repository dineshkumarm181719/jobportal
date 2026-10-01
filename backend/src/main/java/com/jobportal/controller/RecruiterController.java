package com.jobportal.controller;

import com.jobportal.dto.ApiResponse;
import com.jobportal.dto.JobDTO;
import com.jobportal.dto.PagedResponse;
import com.jobportal.dto.RecruiterDTO;
import com.jobportal.dto.UserDTO;
import com.jobportal.entity.User;
import com.jobportal.repository.UserRepository;
import com.jobportal.service.JobService;
import com.jobportal.service.RecruiterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recruiter")
@RequiredArgsConstructor
public class RecruiterController {

    private final RecruiterService recruiterService;
    private final JobService jobService;
    private final UserRepository userRepository;

    @GetMapping("/profile")
    @PreAuthorize("hasAnyRole('RECRUITER', 'COMPANY_ADMIN')")
    public ResponseEntity<ApiResponse<RecruiterDTO.RecruiterResponse>> getProfile(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getUserFromPrincipal(userDetails);
        RecruiterDTO.RecruiterResponse response = recruiterService.getRecruiterProfile(user);
        return ResponseEntity.ok(ApiResponse.success("Recruiter profile retrieved", response));
    }

    @PutMapping("/profile")
    @PreAuthorize("hasAnyRole('RECRUITER', 'COMPANY_ADMIN')")
    public ResponseEntity<ApiResponse<RecruiterDTO.RecruiterResponse>> updateProfile(
            @RequestBody RecruiterDTO.RecruiterProfileRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getUserFromPrincipal(userDetails);
        RecruiterDTO.RecruiterResponse response = recruiterService.updateRecruiterProfile(user, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", response));
    }

    @GetMapping("/jobs")
    @PreAuthorize("hasAnyRole('RECRUITER', 'COMPANY_ADMIN')")
    public ResponseEntity<PagedResponse<JobDTO.JobResponse>> getMyJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getUserFromPrincipal(userDetails);
        PagedResponse<JobDTO.JobResponse> response = jobService.getJobsByRecruiter(user, page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/dashboard-stats")
    @PreAuthorize("hasAnyRole('RECRUITER', 'COMPANY_ADMIN')")
    public ResponseEntity<ApiResponse<UserDTO.RecruiterDashboardStats>> getDashboardStats(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getUserFromPrincipal(userDetails);
        UserDTO.RecruiterDashboardStats stats = recruiterService.getDashboardStats(user);
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats retrieved", stats));
    }

    @PostMapping("/add")
    @PreAuthorize("hasAnyRole('COMPANY_ADMIN', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<RecruiterDTO.RecruiterResponse>> createRecruiter(
            @Valid @RequestBody RecruiterDTO.RecruiterCreateRequest request
    ) {
        RecruiterDTO.RecruiterResponse response = recruiterService.createRecruiter(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Recruiter created successfully", response));
    }

    private User getUserFromPrincipal(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
    }
}
