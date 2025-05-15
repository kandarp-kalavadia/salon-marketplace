package com.kandarp.salon.shared.exception;

public class PaymentException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public PaymentException() {
		super();
	}

	public PaymentException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
		super(message, cause, enableSuppression, writableStackTrace);
	}

	public PaymentException(String message, Throwable cause) {
		super(message, cause);
	}

	public PaymentException(String message) {
		super(message);
	}

	public PaymentException(Throwable cause) {
		super(cause);
	}

}
