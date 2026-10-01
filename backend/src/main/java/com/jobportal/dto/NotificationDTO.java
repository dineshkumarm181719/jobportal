package com.jobportal.dto;

import com.jobportal.enums.NotificationType;
import lombok.*;

import java.time.LocalDateTime;

public class NotificationDTO {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class NotificationResponse {
        private Long id;
        private Long userId;
        private String title;
        private String message;
        private NotificationType type;
        private Boolean isRead;
        private LocalDateTime createdAt;
    }
}
