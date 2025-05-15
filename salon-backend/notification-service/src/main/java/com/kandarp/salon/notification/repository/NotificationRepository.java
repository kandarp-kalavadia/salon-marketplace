package com.kandarp.salon.notification.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kandarp.salon.notification.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
	
	List<Notification> findByUserId(String userId);

	List<Notification> findBySalonId(Long salonId);
}