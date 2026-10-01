package com.jobportal.controller;

import com.jobportal.dto.ApiResponse;
import com.jobportal.dto.ApplicationDTO;
import com.jobportal.dto.PagedResponse;
import com.jobportal.entity.User;
import com.jobportal.repository.UserRepository;
import com.jobportal.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;
    private final UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<ApplicationDTO.ApplicationResponse>> applyForJob(
            @Valid @RequestBody ApplicationDTO.ApplicationRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getUserFromPrincipal(userDetails);
        ApplicationDTO.ApplicationResponse response = applicationService.applyForJob(user, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Application submitted successfully", response));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<PagedResponse<ApplicationDTO.ApplicationResponse>> getMyApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getUserFromPrincipal(userDetails);
        PagedResponse<ApplicationDTO.ApplicationResponse> response = applicationService.getCandidateApplications(user, page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/recruiter")
    @PreAuthorize("hasAnyRole('RECRUITER', 'COMPANY_ADMIN', 'SYSTEM_ADMIN')")
    public ResponseEntity<PagedResponse<ApplicationDTO.ApplicationResponse>> getRecruiterApplications(
            @RequestParam(required = false) Long jobId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getUserFromPrincipal(userDetails);
        PagedResponse<ApplicationDTO.ApplicationResponse> response = applicationService.getRecruiterApplications(user, jobId, page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ApplicationDTO.ApplicationResponse>> getApplicationById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getUserFromPrincipal(userDetails);
        ApplicationDTO.ApplicationResponse response = applicationService.getApplicationById(id, user);
        return ResponseEntity.ok(ApiResponse.success("Application retrieved", response));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ApplicationDTO.ApplicationResponse>> updateApplicationStatus(
            @PathVariable Long id,
            @Valid @RequestBody ApplicationDTO.ApplicationStatusUpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getUserFromPrincipal(userDetails);
        ApplicationDTO.ApplicationResponse response = applicationService.updateApplicationStatus(id, user, request);
        return ResponseEntity.ok(ApiResponse.success("Application status updated", response));
    }

    private User getUserFromPrincipal(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
    }
}
