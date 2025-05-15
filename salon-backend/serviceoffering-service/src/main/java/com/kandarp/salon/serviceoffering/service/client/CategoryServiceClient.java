package com.kandarp.salon.serviceoffering.service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.kandarp.salon.shared.category.dto.CategoryResponseDto;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;

@FeignClient(name = "category-service")
@CircuitBreaker(name = "CategoryServiceCall")
@Retry(name = "CategoryServiceCall")
public interface CategoryServiceClient {
    @GetMapping("/api/v1/categories/{categoryId}")
    ResponseEntity<CategoryResponseDto> getCategoryById(@PathVariable Long categoryId);
}