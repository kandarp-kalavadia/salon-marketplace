package com.kandarp.salon.payment.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.kandarp.salon.shared.constant.Messaging;

@Configuration
public class RabbitMQConfig {

	@Bean
	Jackson2JsonMessageConverter jackson2JsonMessageConverter() {
		return new Jackson2JsonMessageConverter();
	}

	@Bean
	DirectExchange paymentExchange() {
		return new DirectExchange(Messaging.PAYMENT_EXCHANGE);
	}

	@Bean
	Queue bookingQueue() {
		return new Queue(Messaging.BOOKING_QUEUE);
	}

	@Bean
	Binding bookingQueueBinding(Queue bookingQueue, DirectExchange paymentExchange) {
		return BindingBuilder.bind(bookingQueue).to(paymentExchange)
				.with(Messaging.PAYMENT_EXCHANGE_BOOKING_ROUTING_KEY);
	}
}