package com.kandarp.salon.notification.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {
    private Long id;
    private String type;
    private boolean notificationRead;
    private String description;
    private String userId;
    private Long bookingId;
    private Long salonId;
    private LocalDateTime createdAt;
}