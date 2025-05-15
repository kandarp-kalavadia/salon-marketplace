package com.kandarp.salon.shared.payment.dto;

import java.math.BigDecimal;

import com.kandarp.salon.shared.payment.constant.PaymentMethod;
import com.kandarp.salon.shared.payment.constant.PaymentOrderStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentOrderDto {
    private Long id;
    private BigDecimal amount;
    private PaymentOrderStatus status;
    private PaymentMethod paymentMethod;
    private String customerUserId;
    private Long bookingId;
    private Long salonId;
}