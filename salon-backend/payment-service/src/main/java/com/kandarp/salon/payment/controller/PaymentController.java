package com.kandarp.salon.payment.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kandarp.salon.payment.dto.PaymentLinkResponseDto;
import com.kandarp.salon.payment.service.PaymentService;
import com.kandarp.salon.shared.payment.dto.PaymentOrderDto;
import com.kandarp.salon.shared.payment.dto.PaymentOrderRequestDto;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.net.Webhook;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@SecurityRequirement(name = "Keycloak")
public class PaymentController {

	private static final Logger LOGGER = LoggerFactory.getLogger(PaymentController.class);

	private final PaymentService paymentService;

	@Value("${stripe.webhook-secret}")
	private String webhookSecret;

	@PostMapping("/create")
	public ResponseEntity<PaymentLinkResponseDto> createPaymentLink(@AuthenticationPrincipal Jwt jwt,
			@RequestBody PaymentOrderRequestDto paymentOrderRequestDto) {
		LOGGER.info("Creating payment link for booking {}", paymentOrderRequestDto.getBookingId());
		PaymentLinkResponseDto response = paymentService.createOrder(jwt.getSubject(), paymentOrderRequestDto);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/{paymentOrderId}")
	public ResponseEntity<PaymentOrderDto> getPaymentOrderById(@PathVariable Long paymentOrderId) {
		PaymentOrderDto order = paymentService.getPaymentOrderById(paymentOrderId);
		return ResponseEntity.ok(order);
	}

	@PostMapping("/webhook")
	public ResponseEntity<String> handleWebhook(@RequestBody String payload,
			@RequestHeader("Stripe-Signature") String sigHeader) {
		try {
			Event event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
			paymentService.handleEvent(event);
			return ResponseEntity.ok("Success");
		} catch (SignatureVerificationException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing webhook");
		}
	}
}