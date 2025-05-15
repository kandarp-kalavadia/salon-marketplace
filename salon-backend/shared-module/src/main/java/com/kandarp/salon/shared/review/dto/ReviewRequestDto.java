package com.kandarp.salon.shared.review.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequestDto {

	@NotBlank(message = "Review text is required")
	private String reviewText;

	@NotNull(message = "Rating is required")
	@Min(value = 1, message = "Rating must be at least 1.0")
	@Max(value = 5, message = "Rating must be at most 5.0")
	private Double rating;

	@NotNull(message = "Salon ID is required")
	private Long salonId;

	public String getReviewText() {
		return reviewText;
	}

	public void setReviewText(String reviewText) {
		this.reviewText = reviewText;
	}

	public Double getRating() {
		return rating;
	}

	public void setRating(Double rating) {
		this.rating = rating;
	}

	public Long getSalonId() {
		return salonId;
	}

	public void setSalonId(Long salonId) {
		this.salonId = salonId;
	}
}