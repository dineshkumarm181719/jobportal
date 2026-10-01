package com.jobportal.controller;

import com.jobportal.dto.ApiResponse;
import com.jobportal.dto.PagedResponse;
import com.jobportal.dto.UserDTO;
import com.jobportal.enums.Role;
import com.jobportal.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('SYSTEM_ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<UserDTO.AdminDashboardStats>> getStats() {
        UserDTO.AdminDashboardStats stats = adminService.getAdminStats();
        return ResponseEntity.ok(ApiResponse.success("System statistics retrieved", stats));
    }

    @GetMapping("/users")
    public ResponseEntity<PagedResponse<UserDTO.UserResponse>> getAllUsers(
            @RequestParam(required = false) Role role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<UserDTO.UserResponse> response = adminService.getAllUsers(role, page, size);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<UserDTO.UserResponse>> updateUserStatus(
            @PathVariable Long id,
            @Valid @RequestBody UserDTO.UserStatusUpdateRequest request
    ) {
        UserDTO.UserResponse response = adminService.updateUserStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success("User status updated successfully", response));
    }
}
