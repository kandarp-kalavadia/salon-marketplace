package com.kandarp.salon.review.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kandarp.salon.review.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findBySalonId(Long salonId);
    List<Review> findByUserId(String userId);
}