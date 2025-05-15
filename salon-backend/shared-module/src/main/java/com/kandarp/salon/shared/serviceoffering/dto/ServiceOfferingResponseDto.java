package com.kandarp.salon.shared.serviceoffering.dto;

import java.math.BigDecimal;
import java.time.Duration;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ServiceOfferingResponseDto {
	private Long id;
	private String name;
	private String description;
	private BigDecimal price;
	private Duration duration;
	private Long salonId;
	private Long categoryId;
	private boolean available;
	private String image;

}