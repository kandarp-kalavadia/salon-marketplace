package com.kandarp.salon.shared.booking.dto;

import java.time.LocalDateTime;
import java.util.Set;

import com.kandarp.salon.shared.payment.constant.PaymentMethod;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequestDto {

    @NotNull(message = "Start time is required")
    private LocalDateTime startTime;

    @NotEmpty(message = "At least one service is required")
    private Set<Long> serviceIds;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;

   
}