package com.kandarp.salon.review.exception.handler;

import java.io.IOException;
import java.net.URI;
import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ProblemDetail;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Custom AuthenticationEntryPoint to return RFC 9457-compliant ProblemDetail
 * for 401 Unauthorized errors.
 */
@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

	private static final Logger LOGGER = LoggerFactory.getLogger(CustomAuthenticationEntryPoint.class);
	private static final String TYPE = "about:blank";

	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException authException) throws IOException {

		LOGGER.error("Authentication error: {}", authException.getMessage(), authException);

		if (response.isCommitted()) {
			LOGGER.warn("Response already committed. Ignoring error.");
			return;
		}

		ProblemDetail problemDetail = createProblemDetail(request);

		response.setStatus(HttpStatus.UNAUTHORIZED.value());
		response.setContentType(MediaType.APPLICATION_PROBLEM_JSON_VALUE);
		response.getWriter().write(new MappingJackson2HttpMessageConverter()
                .getObjectMapper().writeValueAsString(problemDetail));
	}

	private ProblemDetail createProblemDetail(HttpServletRequest request) {
		ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.UNAUTHORIZED,
				"Authentication failed");
		problemDetail.setType(URI.create(TYPE));
		problemDetail.setTitle("Unauthorized");
		problemDetail.setInstance(URI.create(request.getRequestURI()));
		problemDetail.setProperty("timestamp", LocalDateTime.now().toString());
		problemDetail.setProperty("details", null);
		return problemDetail;
	}
}
