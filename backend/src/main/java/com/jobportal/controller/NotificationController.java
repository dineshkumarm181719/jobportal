package com.jobportal.controller;

import com.jobportal.dto.ApiResponse;
import com.jobportal.dto.NotificationDTO;
import com.jobportal.dto.PagedResponse;
import com.jobportal.entity.User;
import com.jobportal.repository.UserRepository;
import com.jobportal.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<PagedResponse<NotificationDTO.NotificationResponse>> getNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getUserFromPrincipal(userDetails);
        PagedResponse<NotificationDTO.NotificationResponse> response = notificationService.getUserNotificationsPaged(user, page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getUserFromPrincipal(userDetails);
        long count = notificationService.getUnreadCount(user);
        return ResponseEntity.ok(ApiResponse.success("Unread count retrieved", Map.of("count", count)));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getUserFromPrincipal(userDetails);
        notificationService.markAsRead(id, user);
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", null));
    }

    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = getUserFromPrincipal(userDetails);
        notificationService.markAllAsRead(user);
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", null));
    }

    private User getUserFromPrincipal(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
    }
}
