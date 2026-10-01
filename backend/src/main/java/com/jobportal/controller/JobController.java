package com.jobportal.controller;

import com.jobportal.dto.ApiResponse;
import com.jobportal.dto.JobDTO;
import com.jobportal.dto.PagedResponse;
import com.jobportal.entity.User;
import com.jobportal.enums.EmploymentType;
import com.jobportal.enums.JobStatus;
import com.jobportal.repository.UserRepository;
import com.jobportal.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<PagedResponse<JobDTO.JobResponse>> searchJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) EmploymentType employmentType,
            @RequestParam(required = false) String experience,
            @RequestParam(required = false) BigDecimal minSalary,
            @RequestParam(required = false) JobStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getUserFromPrincipal(userDetails);
        PagedResponse<JobDTO.JobResponse> response = jobService.searchJobs(
                keyword, location, employmentType, experience, minSalary, status, page, size, sortBy, sortDir, user
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JobDTO.JobResponse>> getJobById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getUserFromPrincipal(userDetails);
        JobDTO.JobResponse response = jobService.getJobById(id, user);
        return ResponseEntity.ok(ApiResponse.success("Job retrieved successfully", response));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('RECRUITER', 'COMPANY_ADMIN', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<JobDTO.JobResponse>> createJob(
            @Valid @RequestBody JobDTO.JobRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getUserFromPrincipal(userDetails);
        JobDTO.JobResponse response = jobService.createJob(user, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Job posted successfully", response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'COMPANY_ADMIN', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<JobDTO.JobResponse>> updateJob(
            @PathVariable Long id,
            @Valid @RequestBody JobDTO.JobRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getUserFromPrincipal(userDetails);
        JobDTO.JobResponse response = jobService.updateJob(id, user, request);
        return ResponseEntity.ok(ApiResponse.success("Job updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'COMPANY_ADMIN', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteJob(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getUserFromPrincipal(userDetails);
        jobService.deleteJob(id, user);
        return ResponseEntity.ok(ApiResponse.success("Job deleted successfully", null));
    }

    private User getUserFromPrincipal(UserDetails userDetails) {
        if (userDetails == null) return null;
        return userRepository.findByEmail(userDetails.getUsername()).orElse(null);
    }
}
