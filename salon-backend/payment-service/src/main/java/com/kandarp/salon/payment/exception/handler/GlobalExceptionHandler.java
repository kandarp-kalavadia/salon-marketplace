package com.kandarp.salon.payment.exception.handler;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import org.springframework.web.util.WebUtils;

import com.kandarp.salon.shared.exception.PaymentException;
import com.kandarp.salon.shared.exception.ValidationException;

/**
 * Global exception handler ensuring RFC 9457-compliant error responses using
 * ProblemDetail. Includes timestamp and details as custom extensions for
 * compatibility with existing format. Document error types at
 * https://yourdomain.com/errors.
 */
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

	private static final Logger LOGGER = LoggerFactory.getLogger(GlobalExceptionHandler.class);
	private static final String TYPE = "about:blank";

	/**
	 * Handle MethodArgumentNotValidException (validation errors). Populates the
	 * details extension with field-specific error messages.
	 */
	@Override
	protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
			HttpHeaders headers, HttpStatusCode status, WebRequest request) {

		LOGGER.error("Validation error: {}", ex.getMessage(), ex);

		Map<String, String> details = new HashMap<>();
		for (FieldError error : ex.getBindingResult().getFieldErrors()) {
			details.put(error.getField(), error.getDefaultMessage());
		}

		ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(status, "Validation failed");
		problemDetail.setType(URI.create(TYPE));
		problemDetail.setTitle("Validation Failed");
		problemDetail.setInstance(URI.create(getRequestPath(request)));
		problemDetail.setProperty("timestamp", LocalDateTime.now());
		problemDetail.setProperty("errors", details);

		return new ResponseEntity<>(problemDetail, headers, status);
	}

	/**
	 * Catch ValidationException exception
	 */
	@ExceptionHandler(ValidationException.class)
	public ResponseEntity<Object> handleValidationException(ValidationException ex, WebRequest request) {
		LOGGER.error("Validation exception: {}", ex.getMessage(), ex);

		ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, ex.getMessage());
		problemDetail.setType(URI.create(TYPE));
		problemDetail.setTitle(ex.getMessage());
		problemDetail.setInstance(URI.create(getRequestPath(request)));
		problemDetail.setProperty("timestamp", LocalDateTime.now());
		problemDetail.setProperty("details", null);

		return new ResponseEntity<>(problemDetail, HttpStatus.BAD_REQUEST);
	}

	/**
	 * Catch PaymentException exception
	 */
	@ExceptionHandler(PaymentException.class)
	public ResponseEntity<Object> handlePaymentException(PaymentException ex, WebRequest request) {
		LOGGER.error("PaymentException exception: {}", ex.getMessage(), ex.getCause());

		ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR,
				ex.getMessage());
		problemDetail.setType(URI.create(TYPE));
		problemDetail.setTitle(ex.getMessage());
		problemDetail.setInstance(URI.create(getRequestPath(request)));
		problemDetail.setProperty("timestamp", LocalDateTime.now());
		problemDetail.setProperty("details", null);

		return new ResponseEntity<>(problemDetail, HttpStatus.INTERNAL_SERVER_ERROR);
	}

	/**
	 * Catch AuthorizationDeniedException exception
	 */
	@ExceptionHandler(AuthorizationDeniedException.class)
	public ResponseEntity<Object> handleAuthorizationDeniedException(Exception ex, WebRequest request) {
		LOGGER.error("Unexpected exception: {}", ex.getMessage(), ex);

		ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.FORBIDDEN,
				"You do not have permission to access requested resource");
		problemDetail.setType(URI.create(TYPE));
		problemDetail.setTitle(ex.getMessage());
		problemDetail.setInstance(URI.create(getRequestPath(request)));
		problemDetail.setProperty("timestamp", LocalDateTime.now());
		problemDetail.setProperty("details", null);

		return new ResponseEntity<>(problemDetail, HttpStatus.FORBIDDEN);
	}

	/**
	 * Catch AuthorizationDeniedException exception
	 */
	@ExceptionHandler(NoSuchElementException.class)
	public ResponseEntity<Object> handleNoSuchElementException(NoSuchElementException ex, WebRequest request) {
		LOGGER.error("Unexpected exception: {}", ex.getMessage(), ex);

		ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, "Resource not found");
		problemDetail.setType(URI.create(TYPE));
		problemDetail.setTitle(ex.getMessage());
		problemDetail.setInstance(URI.create(getRequestPath(request)));
		problemDetail.setProperty("timestamp", LocalDateTime.now());
		problemDetail.setProperty("details", null);

		return new ResponseEntity<>(problemDetail, HttpStatus.NOT_FOUND);
	}

	/**
	 * Catch-all handler for any unhandled exceptions.
	 */
	@ExceptionHandler(Exception.class)
	public ResponseEntity<Object> handleAllExceptions(Exception ex, WebRequest request) {

		LOGGER.error("Unexpected exception: {}", ex.getMessage(), ex);

		if (request instanceof ServletWebRequest servletWebRequest) {
			var response = servletWebRequest.getResponse();
			if (response != null && response.isCommitted()) {
				LOGGER.warn("Response already committed. Ignoring: {}", ex.getMessage());
				return null;
			}
		}

		ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR,
				ex.getMessage());
		problemDetail.setType(URI.create(TYPE));
		problemDetail.setTitle("Internal Server Error");
		problemDetail.setInstance(URI.create(getRequestPath(request)));
		problemDetail.setProperty("timestamp", LocalDateTime.now());
		problemDetail.setProperty("details", null);

		request.setAttribute(WebUtils.ERROR_EXCEPTION_ATTRIBUTE, ex, WebRequest.SCOPE_REQUEST);

		return new ResponseEntity<>(problemDetail, HttpStatus.INTERNAL_SERVER_ERROR);
	}

	/**
	 * Handle all other exceptions defined in ResponseEntityExceptionHandler.
	 */
	@Override
	protected ResponseEntity<Object> handleExceptionInternal(Exception ex, Object body, HttpHeaders headers,
			HttpStatusCode statusCode, WebRequest request) {

		LOGGER.error("Exception occurred: {}", ex.getMessage(), ex);

		ResponseEntity<Object> responseEntity = super.handleExceptionInternal(ex, body, headers, statusCode, request);

		if (responseEntity.getBody() != null && responseEntity.getBody() instanceof ProblemDetail) {
			ProblemDetail problemDetail = (ProblemDetail) responseEntity.getBody();
			problemDetail.setProperty("timestamp", LocalDateTime.now());
			problemDetail.setProperty("errors", null);
		}

		return responseEntity;
	}

	/**
	 * Helper method to extract request path from WebRequest.
	 */
	private String getRequestPath(WebRequest request) {
		if (request instanceof ServletWebRequest servletWebRequest) {
			return servletWebRequest.getRequest().getRequestURI();
		}
		return "/unknown";
	}

}