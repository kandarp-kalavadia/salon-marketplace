package com.kandarp.salon.booking.service.client;

import java.util.List;
import java.util.Set;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.kandarp.salon.shared.serviceoffering.dto.ServiceOfferingResponseDto;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;

@FeignClient(name = "serviceoffering-service")
@CircuitBreaker(name = "ServiceOfferingServiceCall")
@Retry(name = "ServiceOfferingServiceCall")
public interface ServiceOfferingServiceClient {
	
	@GetMapping("/api/v1/salonservices/list/{ids}")
    public ResponseEntity<List<ServiceOfferingResponseDto>> getServiceOfferingByIds(@PathVariable Set<Long> ids);
	

}
