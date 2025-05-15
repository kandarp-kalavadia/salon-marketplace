package com.kandarp.salon.review.service;

import com.kandarp.salon.shared.review.dto.ReviewRequestDto;
import com.kandarp.salon.shared.review.dto.ReviewResponseDto;

import java.util.List;

public interface ReviewService {
    ReviewResponseDto createReview(String userId, ReviewRequestDto dto);
    ReviewResponseDto getReviewById(Long id);
    List<ReviewResponseDto> getReviewsBySalon(Long salonId);
    List<ReviewResponseDto> getReviewsByUser(String userId);
    ReviewResponseDto updateReview(Long id, String userId, ReviewRequestDto dto);
    void deleteReview(Long id, String userId);
}