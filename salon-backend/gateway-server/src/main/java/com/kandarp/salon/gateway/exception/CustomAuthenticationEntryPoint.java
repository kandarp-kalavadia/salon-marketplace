package com.kandarp.salon.gateway.exception;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ProblemDetail;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.server.ServerAuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import com.fasterxml.jackson.core.JsonProcessingException;

import reactor.core.publisher.Mono;

/**
 * Custom AuthenticationEntryPoint to return RFC 9457-compliant ProblemDetail
 * for 401 Unauthorized errors.
 */
@Component
public class CustomAuthenticationEntryPoint implements ServerAuthenticationEntryPoint {

    private static final Logger LOGGER = LoggerFactory.getLogger(CustomAuthenticationEntryPoint.class);
    private static final String TYPE = "about:blank";

    @Override
    public Mono<Void> commence(ServerWebExchange exchange, AuthenticationException ex) {
        LOGGER.error("Authentication error: {}", ex.getMessage(), ex);

        ProblemDetail problemDetail = createProblemDetail(
            HttpStatus.UNAUTHORIZED,
            ex.getMessage(),
            "Unauthorized",
            exchange.getRequest().getURI().getPath()
        );

        return writeResponse(exchange, problemDetail, HttpStatus.UNAUTHORIZED);
    }

    private ProblemDetail createProblemDetail(HttpStatus status, String detail, String title, String path) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(status, detail);
        problemDetail.setType(URI.create(TYPE));
        problemDetail.setTitle(title);
        problemDetail.setInstance(URI.create(path));
        Map<String, Object> properties = new HashMap<>();
        properties.put("timestamp", LocalDateTime.now().toString());
        properties.put("details", null);
        properties.forEach(problemDetail::setProperty);
        return problemDetail;
    }

    private Mono<Void> writeResponse(ServerWebExchange exchange, ProblemDetail problemDetail, HttpStatus status) {
        exchange.getResponse().setStatusCode(status);
        exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_PROBLEM_JSON);

        return Mono.fromCallable(() -> new MappingJackson2HttpMessageConverter()
                .getObjectMapper().writeValueAsBytes(problemDetail))
            .onErrorResume(JsonProcessingException.class, e -> handleSerializationError(exchange, e))
            .flatMap(bytes -> exchange.getResponse().writeWith(Mono.just(
                exchange.getResponse().bufferFactory().wrap(bytes)
            )));
    }

    private Mono<byte[]> handleSerializationError(ServerWebExchange exchange, JsonProcessingException e) {
        LOGGER.error("JSON serialization error: {}", e.getMessage(), e);
        ProblemDetail fallbackDetail = createProblemDetail(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "Error serializing response",
            "Internal Server Error",
            exchange.getRequest().getURI().getPath()
        );
        return Mono.fromCallable(() -> new MappingJackson2HttpMessageConverter()
                .getObjectMapper().writeValueAsBytes(fallbackDetail))
            .onErrorResume(JsonProcessingException.class, ex -> {
                LOGGER.error("Fallback JSON serialization error: {}", ex.getMessage(), ex);
                return Mono.just("{}".getBytes());
            });
    }
}
