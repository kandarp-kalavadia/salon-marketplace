package com.kandarp.salon.shared.payment.dto;

import java.math.BigDecimal;

import com.kandarp.salon.shared.payment.constant.PaymentMethod;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentOrderRequestDto {

	@NotNull(message = "Booking ID is required")
	private Long bookingId;

	private String customerUserId;
	
	private String customerUserEmail;

	private Long salonId;

	private BigDecimal totalAmount;
	
	private PaymentMethod paymentMethod;

}