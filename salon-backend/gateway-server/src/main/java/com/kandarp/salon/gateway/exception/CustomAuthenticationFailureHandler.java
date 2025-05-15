package com.kandarp.salon.gateway.exception;

import java.net.URI;
import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ProblemDetail;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.server.WebFilterExchange;
import org.springframework.security.web.server.authentication.ServerAuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import com.fasterxml.jackson.core.JsonProcessingException;

import reactor.core.publisher.Mono;

/**
 * Custom AuthenticationFailureHandler to return RFC 9457-compliant
 * ProblemDetail for 401 Unauthorized errors.
 */
@Component
public class CustomAuthenticationFailureHandler implements ServerAuthenticationFailureHandler {

	private static final Logger LOGGER = LoggerFactory.getLogger(CustomAuthenticationFailureHandler.class);
	private static final String TYPE = "about:blank";

	@Override
	public Mono<Void> onAuthenticationFailure(WebFilterExchange webFilterExchange, AuthenticationException exception) {
		ServerWebExchange exchange = webFilterExchange.getExchange();

		LOGGER.error("Authentication failure: {}", exception.getMessage(), exception);

		ProblemDetail problemDetail = createProblemDetail(exchange, exception);

		exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
		exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_PROBLEM_JSON);

		return Mono.fromCallable(
				() -> new MappingJackson2HttpMessageConverter().getObjectMapper().writeValueAsBytes(problemDetail))
				.onErrorResume(JsonProcessingException.class, e -> {
					LOGGER.error("Error serializing ProblemDetail: {}", e.getMessage(), e);
					return Mono.just("{\"title\":\"Internal Server Error\",\"status\":500}".getBytes());
				}).flatMap(bytes -> exchange.getResponse()
						.writeWith(Mono.just(exchange.getResponse().bufferFactory().wrap(bytes))));
	}

	private ProblemDetail createProblemDetail(ServerWebExchange exchange, AuthenticationException exception) {
		ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.UNAUTHORIZED,
				"Authentication failed: " + exception.getMessage());
		problemDetail.setType(URI.create(TYPE));
		problemDetail.setTitle("Unauthorized");
		problemDetail.setInstance(URI.create(exchange.getRequest().getURI().getPath()));
		problemDetail.setProperty("timestamp", LocalDateTime.now().toString());
		problemDetail.setProperty("details", null);
		return problemDetail;
	}
}
