package com.kandarp.salon.review.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.kandarp.salon.shared.user.dto.UserDto;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;

@FeignClient(name = "user-service")
@CircuitBreaker(name = "UserServiceCall")
@Retry(name = "UserServiceCall")
public interface UserServiceClient {
	
	
	@GetMapping("/api/v1/users/{userId}")
	public ResponseEntity<UserDto> getUserByUserId(@PathVariable String userId);
	

}
