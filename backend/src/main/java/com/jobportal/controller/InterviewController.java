package com.jobportal.controller;

import com.jobportal.dto.ApiResponse;
import com.jobportal.dto.InterviewDTO;
import com.jobportal.dto.PagedResponse;
import com.jobportal.entity.User;
import com.jobportal.repository.UserRepository;
import com.jobportal.service.InterviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interviews")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;
    private final UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasAnyRole('RECRUITER', 'COMPANY_ADMIN', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<InterviewDTO.InterviewResponse>> scheduleInterview(
            @Valid @RequestBody InterviewDTO.InterviewRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getUserFromPrincipal(userDetails);
        InterviewDTO.InterviewResponse response = interviewService.scheduleInterview(user, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Interview scheduled successfully", response));
    }

    @GetMapping
    public ResponseEntity<PagedResponse<InterviewDTO.InterviewResponse>> getInterviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getUserFromPrincipal(userDetails);
        PagedResponse<InterviewDTO.InterviewResponse> response = interviewService.getInterviewsForUser(user, page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse<List<InterviewDTO.InterviewResponse>>> getUpcomingInterviews(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getUserFromPrincipal(userDetails);
        List<InterviewDTO.InterviewResponse> response = interviewService.getUpcomingInterviews(user);
        return ResponseEntity.ok(ApiResponse.success("Upcoming interviews retrieved", response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'COMPANY_ADMIN', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<InterviewDTO.InterviewResponse>> updateInterviewStatus(
            @PathVariable Long id,
            @Valid @RequestBody InterviewDTO.InterviewStatusUpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getUserFromPrincipal(userDetails);
        InterviewDTO.InterviewResponse response = interviewService.updateInterviewStatus(id, user, request);
        return ResponseEntity.ok(ApiResponse.success("Interview status updated", response));
    }

    private User getUserFromPrincipal(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
    }
}
