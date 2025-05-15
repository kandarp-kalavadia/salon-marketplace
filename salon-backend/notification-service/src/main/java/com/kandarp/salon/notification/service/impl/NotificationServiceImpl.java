package com.kandarp.salon.notification.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.kandarp.salon.notification.dto.NotificationDto;
import com.kandarp.salon.notification.dto.NotificationRequestDto;
import com.kandarp.salon.notification.entity.Notification;
import com.kandarp.salon.notification.mapper.NotificationMapper;
import com.kandarp.salon.notification.repository.NotificationRepository;
import com.kandarp.salon.notification.service.NotificationService;
import com.kandarp.salon.notification.service.client.BookingServiceClient;
import com.kandarp.salon.notification.service.client.SalonServiceClient;
import com.kandarp.salon.shared.booking.dto.BookingResponseDto;
import com.kandarp.salon.shared.constant.NotificationType;
import com.kandarp.salon.shared.salon.dto.SalonResponseDto;
import com.kandarp.salon.shared.user.dto.UserDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

	private static final Logger LOGGER = LoggerFactory.getLogger(NotificationServiceImpl.class);

	private final NotificationRepository notificationRepository;
	private final SalonServiceClient salonServiceClient;
	private final BookingServiceClient bookingServiceClient;
	private final NotificationMapper notificationMapper;

	@Override
	public NotificationDto createNotification(NotificationRequestDto notificationRequestDto) {
		LOGGER.info("Creating notification for booking {}", notificationRequestDto.getBookingId());
		Notification notification = notificationMapper.toEntity(notificationRequestDto);
		Notification savedNotification = notificationRepository.save(notification);
		return notificationMapper.toDTO(savedNotification);
	}

	@Override
	public List<NotificationDto> getAllNotificationsByUserId(String userId) {
		LOGGER.debug("Fetching notifications for user {}", userId);
		List<Notification> notifications = notificationRepository.findByUserId(userId);
		return notifications.stream().map(notification -> {
			ResponseEntity<BookingResponseDto> responseEntity = bookingServiceClient
					.getBookingById(notification.getBookingId());
			BookingResponseDto bookingResponseDto = responseEntity.getBody();
			SalonResponseDto salon = bookingResponseDto.getSalon();
			NotificationDto dto = notificationMapper.toDTO(notification);
			if (NotificationType.NOTIFICATION_TYPE_BOOKING.equalsIgnoreCase(dto.getType())) {
				dto.setDescription("New Booking with " + salon.getSalonName() + " confirmed.");
			}
			return dto;
		}).collect(Collectors.toList());

	}

	@Override
	public List<NotificationDto> getAllNotificationsForSalon(String salonOwnerUserId) {
		ResponseEntity<SalonResponseDto> salonByOwner = salonServiceClient.getSalonByOwnerId(salonOwnerUserId);
		SalonResponseDto salonResponseDto = salonByOwner.getBody();
		LOGGER.debug("Fetching notifications for salon {}", salonResponseDto.getSalonId());
		List<Notification> notifications = notificationRepository.findBySalonId(salonResponseDto.getSalonId());
		return notifications.stream().map(notification -> {
			ResponseEntity<BookingResponseDto> responseEntity = bookingServiceClient
					.getBookingById(notification.getBookingId());
			BookingResponseDto bookingResponseDto = responseEntity.getBody();
			UserDto customer = bookingResponseDto.getCustomer();
			NotificationDto dto = notificationMapper.toDTO(notification);
			if (NotificationType.NOTIFICATION_TYPE_BOOKING.equalsIgnoreCase(dto.getType())) {
				dto.setDescription(
						"New Booking confirmed by " + customer.getFirstName() + " " + customer.getLastName());
			}
			return dto;
		}).collect(Collectors.toList());
	}

	@Override
	public NotificationDto markNotificationAsRead(Long notificationId) {
		LOGGER.info("Marking notification {} as read", notificationId);
		Notification notification = notificationRepository.findById(notificationId).orElseThrow();
		notification.setNotificationRead(true);
		Notification updated = notificationRepository.save(notification);
		return notificationMapper.toDTO(updated);
	}

	@Override
	public void deleteNotification(Long notificationId) {
		LOGGER.info("Deleting notification {}", notificationId);
		Notification notification = notificationRepository.findById(notificationId).orElseThrow();
		notificationRepository.delete(notification);
	}
}