package com.kandarp.salon.service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.kandarp.salon.shared.user.dto.UserCreationDto;
import com.kandarp.salon.shared.user.dto.UserDto;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;

@FeignClient(name = "user-service")
@CircuitBreaker(name = "UserServiceCall")
@Retry(name = "UserServiceCall")
public interface UserServiceClient {
	
	@PostMapping(value = "/api/v1/users/salon/signup", consumes = "application/json")
    ResponseEntity<String> createSalonOwnerUser(@RequestBody UserCreationDto userCreationDto);
	
	@GetMapping("/api/v1/users/{userId}")
	public ResponseEntity<UserDto> getUserByUserId(@PathVariable String userId);
	

}
