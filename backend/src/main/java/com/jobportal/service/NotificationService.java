package com.jobportal.service;

import com.jobportal.dto.NotificationDTO;
import com.jobportal.dto.PagedResponse;
import com.jobportal.entity.Notification;
import com.jobportal.entity.User;
import com.jobportal.enums.NotificationType;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.repository.NotificationRepository;
import com.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Transactional
    public void sendNotification(User user, String title, String message, NotificationType type) {
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .isRead(false)
                .build();
        notificationRepository.save(notification);
    }

    @Transactional
    public void sendNotificationByUserId(Long userId, String title, String message, NotificationType type) {
        userRepository.findById(userId).ifPresent(user -> sendNotification(user, title, message, type));
    }

    @Transactional(readOnly = true)
    public List<NotificationDTO.NotificationResponse> getUserNotifications(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PagedResponse<NotificationDTO.NotificationResponse> getUserNotificationsPaged(User user, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Notification> notificationPage = notificationRepository.findByUserOrderByCreatedAtDesc(user, pageable);
        List<NotificationDTO.NotificationResponse> content = notificationPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return PagedResponse.of(
                content,
                notificationPage.getNumber(),
                notificationPage.getSize(),
                notificationPage.getTotalElements(),
                notificationPage.getTotalPages(),
                notificationPage.isLast()
        );
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(User user) {
        return notificationRepository.countByUserAndIsReadFalse(user);
    }

    @Transactional
    public void markAsRead(Long notificationId, User user) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", notificationId));
        if (notification.getUser().getId().equals(user.getId())) {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        }
    }

    @Transactional
    public void markAllAsRead(User user) {
        List<Notification> unread = notificationRepository.findByUserIdAndIsReadFalse(user.getId());
        for (Notification n : unread) {
            n.setIsRead(true);
        }
        notificationRepository.saveAll(unread);
    }

    private NotificationDTO.NotificationResponse mapToResponse(Notification notification) {
        return NotificationDTO.NotificationResponse.builder()
                .id(notification.getId())
                .userId(notification.getUser().getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
