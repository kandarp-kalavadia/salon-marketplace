package com.kandarp.salon.notification.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kandarp.salon.notification.dto.NotificationDto;
import com.kandarp.salon.notification.service.NotificationService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@SecurityRequirement(name = "Keycloak")
public class NotificationController {

    private static final Logger LOGGER = LoggerFactory.getLogger(NotificationController.class);

    private final NotificationService notificationService;


    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationDto>> getNotificationsByUserId(@PathVariable String userId) {
    	LOGGER.debug("Fetching notifications for user {}", userId);
        List<NotificationDto> notifications = notificationService.getAllNotificationsByUserId(userId);
        return ResponseEntity.ok(notifications);

    }
    
    @GetMapping("/salon/{salonOwnerId}")
    public ResponseEntity<List<NotificationDto>> getNotificationsBySalonId(@PathVariable String salonOwnerId) {
        List<NotificationDto> notifications = notificationService.getAllNotificationsForSalon(salonOwnerId);
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/read/{notificationId}")
    public ResponseEntity<NotificationDto> markNotificationAsRead(@PathVariable Long notificationId) {
    	LOGGER.info("Marking notification {} as read", notificationId);
        NotificationDto updated = notificationService.markNotificationAsRead(notificationId);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long notificationId) {
    	LOGGER.info("Deleting notification {}", notificationId);
        notificationService.deleteNotification(notificationId);
        return ResponseEntity.noContent().build();
    }
}