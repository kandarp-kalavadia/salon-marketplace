package com.kandarp.salon.shared.booking.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import com.kandarp.salon.shared.booking.constant.BookingStatus;
import com.kandarp.salon.shared.salon.dto.SalonResponseDto;
import com.kandarp.salon.shared.serviceoffering.dto.ServiceOfferingResponseDto;
import com.kandarp.salon.shared.user.dto.UserDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponseDto {
	private Long id;
	private Long salonId;
	private String customerUserId;
	private LocalDateTime startTime;
	private LocalDateTime endTime;
	private Set<Long> serviceIds;
	private BookingStatus status;
	private int totalPrice;
	private SalonResponseDto salon;
	private UserDto customer;
	private List<ServiceOfferingResponseDto> services;
}