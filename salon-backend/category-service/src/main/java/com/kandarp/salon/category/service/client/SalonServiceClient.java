package com.kandarp.salon.category.service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.kandarp.salon.shared.salon.dto.SalonResponseDto;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;

@FeignClient(name = "salon-service")
@CircuitBreaker(name = "SalonServiceCall")
@Retry(name = "SalonServiceCall")
public interface SalonServiceClient {
	
	@GetMapping("/api/v1/salons/{salonId}")
	public ResponseEntity<SalonResponseDto> getSalonById(@PathVariable Long salonId);
	
	@GetMapping("/api/v1/salons/owner/{ownerId}")
	public ResponseEntity<SalonResponseDto> getSalonByOwnerId(@PathVariable String ownerId);
	

}
