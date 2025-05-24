package com.kandarp.salon.gateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import reactor.core.publisher.Mono;

@Configuration
public class GlobalLoggingConfig {

	private static final Logger logger = LoggerFactory.getLogger(GlobalLoggingConfig.class);

	@Bean
	GlobalFilter loggingGlobalFilter() {
		return (exchange, chain) -> {
			logger.info("Global Filter: {} {}", exchange.getRequest().getMethod(), exchange.getRequest().getURI());

			return chain.filter(exchange).then(Mono.fromRunnable(() -> {
				logger.info("Global Filter Response: {}", exchange.getResponse().getStatusCode());
			}));
		};
	}
}
