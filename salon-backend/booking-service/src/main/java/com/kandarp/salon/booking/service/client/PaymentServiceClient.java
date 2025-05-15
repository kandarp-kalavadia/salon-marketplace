package com.kandarp.salon.booking.service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;

import com.kandarp.salon.payment.dto.PaymentLinkResponseDto;
import com.kandarp.salon.shared.payment.dto.PaymentOrderRequestDto;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;

@FeignClient(name = "payment-service")
@CircuitBreaker(name = "PaymentServiceCall")
@Retry(name = "PaymentServiceCall")
public interface PaymentServiceClient {

	@PostMapping("/api/v1/payments/create")
	public ResponseEntity<PaymentLinkResponseDto> createPaymentLink(PaymentOrderRequestDto paymentRequestDto);

}
