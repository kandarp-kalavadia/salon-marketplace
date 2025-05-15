package com.kandarp.salon.notification.service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.kandarp.salon.shared.booking.dto.BookingResponseDto;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;

@FeignClient(name = "booking-service")
@CircuitBreaker(name = "BookingServiceCall")
@Retry(name = "BookingServiceCall")
public interface BookingServiceClient {
	
	@GetMapping("/api/v1/bookings/{bookingId}")
	public ResponseEntity<BookingResponseDto> getBookingById(@PathVariable Long bookingId);
	

}
