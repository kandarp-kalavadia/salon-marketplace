package com.kandarp.salon.payment.exception.handler;

import java.io.IOException;
import java.net.URI;
import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ProblemDetail;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Custom AccessDeniedHandler to return RFC 9457-compliant ProblemDetail for 403
 * Forbidden errors.
 */
@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

	private static final Logger LOGGER = LoggerFactory.getLogger(CustomAccessDeniedHandler.class);
	private static final String TYPE = "about:blank";

	@Override
	public void handle(HttpServletRequest request, HttpServletResponse response,
			AccessDeniedException accessDeniedException) throws IOException {

		LOGGER.error("Access denied: {}", accessDeniedException.getMessage(), accessDeniedException);

		if (response.isCommitted()) {
			LOGGER.warn("Response already committed. Ignoring error.");
			return;
		}

		ProblemDetail problemDetail = createProblemDetail(request);

		response.setStatus(HttpStatus.FORBIDDEN.value());
		response.setContentType(MediaType.APPLICATION_PROBLEM_JSON_VALUE);
		response.getWriter().write(new MappingJackson2HttpMessageConverter()
                .getObjectMapper().writeValueAsString(problemDetail));

	}

	private ProblemDetail createProblemDetail(HttpServletRequest request) {
		ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.FORBIDDEN,
				"Access to the requested resource is forbidden");
		problemDetail.setType(URI.create(TYPE));
		problemDetail.setTitle("Forbidden");
		problemDetail.setInstance(URI.create(request.getRequestURI()));
		problemDetail.setProperty("timestamp", LocalDateTime.now().toString());
		problemDetail.setProperty("details", null);
		return problemDetail;
	}
}
