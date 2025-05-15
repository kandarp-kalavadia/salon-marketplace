package com.kandarp.salon.notification.config;

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
	DirectExchange notificationExchange() {
		return new DirectExchange(Messaging.NOTIFICATION_EXCHANGE);
	}

	@Bean
	Queue userQueue() {
		return new Queue(Messaging.USER_QUEUE);
	}

	@Bean
	Queue salonQueue() {
		return new Queue(Messaging.SALON_QUEUE);
	}


	@Bean
	Binding userQueueBinding(Queue userQueue, DirectExchange notificationExchange) {
		return BindingBuilder.bind(userQueue).to(notificationExchange)
				.with(Messaging.NOTIFICATION_EXCHANGE_USER_ROUTING_KEY);
	}

	@Bean
	Binding salonQueueBinding(Queue salonQueue, DirectExchange notificationExchange) {
		return BindingBuilder.bind(salonQueue).to(notificationExchange)
				.with(Messaging.NOTIFICATION_EXCHANGE_SALON_ROUTING_KEY);
	}
}