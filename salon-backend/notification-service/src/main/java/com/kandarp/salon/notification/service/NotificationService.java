package com.kandarp.salon.notification.service;

import java.util.List;

import com.kandarp.salon.notification.dto.NotificationDto;
import com.kandarp.salon.notification.dto.NotificationRequestDto;

public interface NotificationService {

	NotificationDto createNotification(NotificationRequestDto notificationRequestDto);

	List<NotificationDto> getAllNotificationsByUserId(String userId);

	List<NotificationDto> getAllNotificationsForSalon(String salonOwnerUserId);

	NotificationDto markNotificationAsRead(Long notificationId);

	void deleteNotification(Long notificationId);

}
