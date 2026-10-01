package com.jobportal.controller;

import com.jobportal.dto.ApiResponse;
import com.jobportal.dto.CompanyDTO;
import com.jobportal.dto.JobDTO;
import com.jobportal.dto.PagedResponse;
import com.jobportal.dto.RecruiterDTO;
import com.jobportal.entity.User;
import com.jobportal.repository.UserRepository;
import com.jobportal.service.CompanyService;
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
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;
    private final JobService jobService;
    private final RecruiterService recruiterService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<PagedResponse<CompanyDTO.CompanyResponse>> getAllCompanies(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<CompanyDTO.CompanyResponse> response = companyService.getAllCompanies(search, page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CompanyDTO.CompanyResponse>> getCompanyById(@PathVariable Long id) {
        CompanyDTO.CompanyResponse response = companyService.getCompanyById(id);
        return ResponseEntity.ok(ApiResponse.success("Company details retrieved", response));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('COMPANY_ADMIN', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<CompanyDTO.CompanyResponse>> createCompany(
            @Valid @RequestBody CompanyDTO.CompanyRequest request
    ) {
        CompanyDTO.CompanyResponse response = companyService.createCompany(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Company registered successfully", response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('COMPANY_ADMIN', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<CompanyDTO.CompanyResponse>> updateCompany(
            @PathVariable Long id,
            @Valid @RequestBody CompanyDTO.CompanyRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getUserFromPrincipal(userDetails);
        CompanyDTO.CompanyResponse response = companyService.updateCompany(id, user, request);
        return ResponseEntity.ok(ApiResponse.success("Company updated successfully", response));
    }

    @GetMapping("/{id}/jobs")
    public ResponseEntity<PagedResponse<JobDTO.JobResponse>> getCompanyJobs(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<JobDTO.JobResponse> response = jobService.getJobsByCompany(id, page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/recruiters")
    @PreAuthorize("hasAnyRole('COMPANY_ADMIN', 'SYSTEM_ADMIN')")
    public ResponseEntity<PagedResponse<RecruiterDTO.RecruiterResponse>> getCompanyRecruiters(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<RecruiterDTO.RecruiterResponse> response = recruiterService.getRecruitersByCompany(id, page, size);
        return ResponseEntity.ok(response);
    }

    private User getUserFromPrincipal(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
    }
}
