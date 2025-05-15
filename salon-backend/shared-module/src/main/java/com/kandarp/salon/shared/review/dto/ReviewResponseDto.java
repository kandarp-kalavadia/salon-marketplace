package com.kandarp.salon.shared.review.dto;

import com.kandarp.salon.shared.salon.dto.SalonResponseDto;
import com.kandarp.salon.shared.user.dto.UserDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponseDto {

	private Long id;
	private String reviewText;
	private Double rating;
	private SalonResponseDto salon;
	private UserDto user;
	private LocalDateTime createdAt;

}