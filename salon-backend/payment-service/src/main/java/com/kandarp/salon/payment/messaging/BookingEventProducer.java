package com.kandarp.salon.payment.messaging;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import com.kandarp.salon.shared.constant.Messaging;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class BookingEventProducer {

	private static final Logger LOGGER = LoggerFactory.getLogger(BookingEventProducer.class);

	private final RabbitTemplate rabbitTemplate;

	public void sendBookingUpdateEvent(Long bookingId) {
		LOGGER.info("Sending booking update event for Booking id {}", bookingId);
		rabbitTemplate.convertAndSend(Messaging.PAYMENT_EXCHANGE, Messaging.PAYMENT_EXCHANGE_BOOKING_ROUTING_KEY,
				bookingId);
	}
}