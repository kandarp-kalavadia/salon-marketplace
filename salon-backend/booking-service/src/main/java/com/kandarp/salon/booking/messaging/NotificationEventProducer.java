package com.kandarp.salon.booking.messaging;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import com.kandarp.salon.notification.dto.NotificationRequestDto;
import com.kandarp.salon.shared.constant.Messaging;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class NotificationEventProducer {

	private static final Logger LOGGER = LoggerFactory.getLogger(NotificationEventProducer.class);

	private final RabbitTemplate rabbitTemplate;

	public void sendUserNotificationEvent(NotificationRequestDto notificationRequestDto) {
		LOGGER.info("Sending user notification event");
		rabbitTemplate.convertAndSend(Messaging.NOTIFICATION_EXCHANGE, Messaging.NOTIFICATION_EXCHANGE_USER_ROUTING_KEY,
				notificationRequestDto);
	}

	public void sendSalonNotificationEvent(NotificationRequestDto notificationRequestDto) {
		LOGGER.info("Sending salon notification event");
		rabbitTemplate.convertAndSend(Messaging.NOTIFICATION_EXCHANGE,
				Messaging.NOTIFICATION_EXCHANGE_SALON_ROUTING_KEY, notificationRequestDto);
	}
}