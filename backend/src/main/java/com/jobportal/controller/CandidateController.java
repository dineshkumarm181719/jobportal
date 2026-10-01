package com.jobportal.controller;

import com.jobportal.dto.ApiResponse;
import com.jobportal.dto.CandidateDTO;
import com.jobportal.dto.UserDTO;
import com.jobportal.entity.User;
import com.jobportal.repository.UserRepository;
import com.jobportal.service.AdminService;
import com.jobportal.service.CandidateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/candidates")
@RequiredArgsConstructor
public class CandidateController {

    private final CandidateService candidateService;
    private final AdminService adminService;
    private final UserRepository userRepository;

    @GetMapping("/profile")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<CandidateDTO.CandidateResponse>> getProfile(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getUserFromPrincipal(userDetails);
        CandidateDTO.CandidateResponse response = candidateService.getCandidateProfile(user);
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", response));
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<CandidateDTO.CandidateResponse>> updateProfile(
            @RequestBody CandidateDTO.CandidateProfileRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getUserFromPrincipal(userDetails);
        CandidateDTO.CandidateResponse response = candidateService.updateCandidateProfile(user, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", response));
    }

    @PostMapping(value = "/resume", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<CandidateDTO.ResumeResponse>> uploadResume(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getUserFromPrincipal(userDetails);
        CandidateDTO.ResumeResponse response = candidateService.uploadResume(user, file);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Resume uploaded successfully", response));
    }

    @DeleteMapping("/resumes/{resumeId}")
    @PreAuthorize("hasAnyRole('CANDIDATE', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteResume(
            @PathVariable Long resumeId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getUserFromPrincipal(userDetails);
        candidateService.deleteResume(user, resumeId);
        return ResponseEntity.ok(ApiResponse.success("Resume deleted successfully", null));
    }

    @GetMapping("/dashboard-stats")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<UserDTO.CandidateDashboardStats>> getDashboardStats(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getUserFromPrincipal(userDetails);
        UserDTO.CandidateDashboardStats stats = adminService.getCandidateDashboardStats(user);
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats retrieved", stats));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'COMPANY_ADMIN', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<CandidateDTO.CandidateResponse>> getCandidateById(
            @PathVariable Long id
    ) {
        CandidateDTO.CandidateResponse response = candidateService.getCandidateById(id);
        return ResponseEntity.ok(ApiResponse.success("Candidate retrieved successfully", response));
    }

    private User getUserFromPrincipal(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
    }
}
