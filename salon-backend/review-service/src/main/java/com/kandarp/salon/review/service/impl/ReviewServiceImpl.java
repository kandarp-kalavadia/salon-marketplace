package com.kandarp.salon.review.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.kandarp.salon.review.client.SalonServiceClient;
import com.kandarp.salon.review.client.UserServiceClient;
import com.kandarp.salon.review.entity.Review;
import com.kandarp.salon.review.mapper.ReviewMapper;
import com.kandarp.salon.review.repository.ReviewRepository;
import com.kandarp.salon.review.service.ReviewService;
import com.kandarp.salon.shared.review.dto.ReviewRequestDto;
import com.kandarp.salon.shared.review.dto.ReviewResponseDto;
import com.kandarp.salon.shared.salon.dto.SalonResponseDto;
import com.kandarp.salon.shared.user.dto.UserDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

	private final ReviewRepository reviewRepository;
	private final ReviewMapper reviewMapper;
	private final SalonServiceClient salonServiceClient;
	private final UserServiceClient userServiceClient;

	@Override
	public ReviewResponseDto createReview(String userId, ReviewRequestDto dto) {
		// Validate user
		ResponseEntity<UserDto> userResponse = userServiceClient.getUserByUserId(userId);
		UserDto user = userResponse.getBody();

		// Validate salon
		ResponseEntity<SalonResponseDto> salonResponse = salonServiceClient.getSalonById(dto.getSalonId());
		SalonResponseDto salon = salonResponse.getBody();

		// Create review
		Review review = reviewMapper.toEntity(dto);
		review.setUserId(userId);
		Review saved = reviewRepository.save(review);

		// Build response
		return buildResponseDto(saved, salon, user);
	}

	@Override
	public ReviewResponseDto updateReview(Long id, String userId, ReviewRequestDto dto) {
		Review review = reviewRepository.findById(id).orElseThrow();

		// Validate ownership
		if (!review.getUserId().equals(userId)) {
			throw new AccessDeniedException("You are not authorized to update this review");
		}

		// Validate salon
		ResponseEntity<SalonResponseDto> salonResponse = salonServiceClient.getSalonById(dto.getSalonId());
		SalonResponseDto salon = salonResponse.getBody();

		// Validate user
		ResponseEntity<UserDto> userResponse = userServiceClient.getUserByUserId(userId);
		UserDto user = userResponse.getBody();

		// Update review
		reviewMapper.updateEntityFromDto(dto, review);
		Review updated = reviewRepository.save(review);

		return buildResponseDto(updated, salon, user);
	}

	@Override
	public void deleteReview(Long id, String userId) {
		Review review = reviewRepository.findById(id).orElseThrow();

		// Validate ownership
		if (!review.getUserId().equals(userId)) {
			throw new RuntimeException("You are not authorized to delete this review");
		}

		reviewRepository.delete(review);
	}

	@Override
	public ReviewResponseDto getReviewById(Long id) {
		Review review = reviewRepository.findById(id).orElseThrow();
		return buildResponseDto(review, null, null);
	}

	@Override
	public List<ReviewResponseDto> getReviewsBySalon(Long salonId) {
		// Validate salon
		ResponseEntity<SalonResponseDto> salonResponse = salonServiceClient.getSalonById(salonId);
		SalonResponseDto salon = salonResponse.getBody();

		List<Review> reviews = reviewRepository.findBySalonId(salonId);
		return reviews.stream().map(review -> buildResponseDto(review, salon, null)).collect(Collectors.toList());
	}

	@Override
	public List<ReviewResponseDto> getReviewsByUser(String userId) {
		// Validate user
		ResponseEntity<UserDto> userResponse = userServiceClient.getUserByUserId(userId);
		UserDto user = userResponse.getBody();

		List<Review> reviews = reviewRepository.findByUserId(userId);
		return reviews.stream().map(review -> buildResponseDto(review, null, user)).collect(Collectors.toList());
	}

	private ReviewResponseDto buildResponseDto(Review review, SalonResponseDto salon, UserDto user) {
		// Fetch salon if not provided
		if (salon == null) {
			ResponseEntity<SalonResponseDto> salonResponse = salonServiceClient.getSalonById(review.getSalonId());
			salon = salonResponse.getBody();
		}

		// Fetch user if not provided
		if (user == null) {
			ResponseEntity<UserDto> userResponse = userServiceClient.getUserByUserId(review.getUserId());
			user = userResponse.getBody();
		}

		ReviewResponseDto responseDto = reviewMapper.toDto(review);
		responseDto.setSalon(salon);
		responseDto.setUser(user);
		return responseDto;
	}
}