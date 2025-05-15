package com.kandarp.salon.shared.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SalonBookingReportDto {
	private Double totalEarnings;
	private Integer totalBookings;
	private Integer cancelledBookings;
	private Double totalRefund;
}