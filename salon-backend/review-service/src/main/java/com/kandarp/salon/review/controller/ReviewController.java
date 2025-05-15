package com.kandarp.salon.review.controller;

import com.kandarp.salon.review.service.ReviewService;
import com.kandarp.salon.shared.review.dto.ReviewRequestDto;
import com.kandarp.salon.shared.review.dto.ReviewResponseDto;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
@SecurityRequirement(name = "Keycloak")
public class ReviewController {

	private final ReviewService reviewService;

	@PostMapping
	public ResponseEntity<ReviewResponseDto> createReview(@Valid @RequestBody ReviewRequestDto requestDto,
			@AuthenticationPrincipal Jwt jwt) {
		ReviewResponseDto responseDto = reviewService.createReview(jwt.getSubject(), requestDto);
		return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
	}

	@GetMapping("/{id}")
	public ResponseEntity<ReviewResponseDto> getReviewById(@PathVariable Long id) {
		ReviewResponseDto responseDto = reviewService.getReviewById(id);
		return ResponseEntity.ok(responseDto);
	}

	@GetMapping("/salon/{salonId}")
	public ResponseEntity<List<ReviewResponseDto>> getReviewsBySalon(@PathVariable Long salonId) {
		List<ReviewResponseDto> responseDtos = reviewService.getReviewsBySalon(salonId);
		return ResponseEntity.ok(responseDtos);
	}

	@GetMapping("/user")
	public ResponseEntity<List<ReviewResponseDto>> getReviewsByUser(@AuthenticationPrincipal Jwt jwt) {
		List<ReviewResponseDto> responseDtos = reviewService.getReviewsByUser(jwt.getSubject());
		return ResponseEntity.ok(responseDtos);
	}

	@PutMapping("/{id}")
	public ResponseEntity<ReviewResponseDto> updateReview(@PathVariable Long id,
			@Valid @RequestBody ReviewRequestDto requestDto, @AuthenticationPrincipal Jwt jwt) {
		ReviewResponseDto responseDto = reviewService.updateReview(id, jwt.getSubject(), requestDto);
		return ResponseEntity.ok(responseDto);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteReview(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
		reviewService.deleteReview(id, jwt.getSubject());
		return ResponseEntity.noContent().build();
	}
}