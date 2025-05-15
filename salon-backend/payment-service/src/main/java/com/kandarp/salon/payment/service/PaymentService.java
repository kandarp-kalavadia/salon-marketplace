package com.kandarp.salon.payment.service;

import com.kandarp.salon.payment.dto.PaymentLinkResponseDto;
import com.kandarp.salon.shared.payment.dto.PaymentOrderDto;
import com.kandarp.salon.shared.payment.dto.PaymentOrderRequestDto;
import com.stripe.model.Event;

public interface PaymentService {

	PaymentLinkResponseDto createOrder(String jwt, PaymentOrderRequestDto paymentOrderRequestDto);

	PaymentOrderDto getPaymentOrderById(Long id);

	void handleEvent(Event event);

}
