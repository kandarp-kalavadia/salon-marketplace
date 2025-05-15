package com.kandarp.salon.payment.service.impl;

import java.math.BigDecimal;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kandarp.salon.payment.dto.PaymentLinkResponseDto;
import com.kandarp.salon.payment.entity.PaymentOrder;
import com.kandarp.salon.payment.mapper.PaymentOrderMapper;
import com.kandarp.salon.payment.messaging.BookingEventProducer;
import com.kandarp.salon.payment.repository.PaymentOrderRepository;
import com.kandarp.salon.payment.service.PaymentService;
import com.kandarp.salon.shared.exception.PaymentException;
import com.kandarp.salon.shared.payment.constant.PaymentOrderStatus;
import com.kandarp.salon.shared.payment.dto.PaymentOrderDto;
import com.kandarp.salon.shared.payment.dto.PaymentOrderRequestDto;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

	private static final Logger LOGGER = LoggerFactory.getLogger(PaymentServiceImpl.class);

	@Value("${stripe.api-key}")
	private String stripeSecretKey;

	@Value("${stripe.frontend-success-url}")
	private String successUrl;

	@Value("${stripe.frontend-cancel-url}")
	private String cancelUrl;

	private final PaymentOrderRepository paymentOrderRepository;
	private final PaymentOrderMapper paymentOrderMapper;
	private final BookingEventProducer bookingEventProducer;

	@Override
	@Transactional
	public PaymentLinkResponseDto createOrder(String jwt, PaymentOrderRequestDto paymentOrderRequestDto) {
		LOGGER.info("Creating payment order for booking {}", paymentOrderRequestDto.getBookingId());

		PaymentOrder order = new PaymentOrder();
		order.setCustomerUserId(paymentOrderRequestDto.getCustomerUserId());
		order.setAmount(paymentOrderRequestDto.getTotalAmount());
		order.setBookingId(paymentOrderRequestDto.getBookingId());
		order.setSalonId(paymentOrderRequestDto.getSalonId());
		order.setPaymentMethod(paymentOrderRequestDto.getPaymentMethod());
		PaymentOrder savedOrder = paymentOrderRepository.save(order);

		String paymentUrl = createStripePaymentLink(paymentOrderRequestDto.getCustomerUserEmail(), savedOrder);

		return new PaymentLinkResponseDto(paymentUrl);
	}

	@Override
	public void handleEvent(Event event) {
		switch (event.getType()) {
		case "checkout.session.completed":
			handleCompletedSession(event);
			break;
		case "checkout.session.async_payment_failed":
			processEvent(event, PaymentOrderStatus.FAILED);
			break;
		case "checkout.session.async_payment_succeeded":
			processEvent(event, PaymentOrderStatus.SUCCESS);
			break;
		case "checkout.session.expired":
			processEvent(event, PaymentOrderStatus.EXPIRED);
			break;
		default:
			LOGGER.info("Unhandled event type: {}", event.getType());
		}
	}

	private void handleCompletedSession(Event event) {
		Optional<Session> sessionOpt = extractSession(event);
		if (sessionOpt.isEmpty()) {
			return;
		}

		Session session = sessionOpt.get();
		String orderIdStr = session.getMetadata().get("orderId");
		String sessionId = session.getId();

		if (orderIdStr == null) {
			LOGGER.warn("Missing orderId metadata in session {}", sessionId);
			return;
		}

		Long orderId = Long.valueOf(orderIdStr);
		PaymentOrder order = paymentOrderRepository.findById(orderId).orElse(null);

		if (order == null || !sessionId.equals(order.getSessionId())) {
			LOGGER.warn("No matching PaymentOrder found for orderId {} or sessionId {}", orderId, sessionId);
			return;
		}

		PaymentOrderStatus status = "paid".equals(session.getPaymentStatus()) ? PaymentOrderStatus.SUCCESS
				: PaymentOrderStatus.FAILED;
		
		order.setStatus(status);
		
		paymentOrderRepository.save(order);
		
		if(status == PaymentOrderStatus.SUCCESS)
		bookingEventProducer.sendBookingUpdateEvent(order.getBookingId());

		
		LOGGER.info("Updated PaymentOrder {} to {} for session {}", orderId, status, sessionId);
	}

	private void processEvent(Event event, PaymentOrderStatus status) {
		Optional<Session> sessionOpt = extractSession(event);
		if (sessionOpt.isEmpty())
			return;

		Session session = sessionOpt.get();
		String orderIdStr = session.getMetadata().get("orderId");
		String sessionId = session.getId();

		if (orderIdStr == null) {
			LOGGER.warn("Missing orderId metadata in session {}", sessionId);
			return;
		}

		Long orderId = Long.valueOf(orderIdStr);
		PaymentOrder order = paymentOrderRepository.findById(orderId).orElse(null);

		if (order == null || !sessionId.equals(order.getSessionId())) {
			LOGGER.warn("No matching PaymentOrder found for orderId {} or sessionId {}", orderId, sessionId);
			return;
		}

		order.setStatus(status);
		paymentOrderRepository.save(order);
		
		
		LOGGER.info("Updated PaymentOrder {} to {} for session {}", orderId, status, sessionId);
	}

	private Optional<Session> extractSession(Event event) {
		EventDataObjectDeserializer deserializer = event.getDataObjectDeserializer();
		return deserializer.getObject().map(obj -> (Session) obj);
	}

	@Override
	public PaymentOrderDto getPaymentOrderById(Long id) {
		LOGGER.debug("Fetching payment order {}", id);
		PaymentOrder order = paymentOrderRepository.findById(id).orElseThrow();
		return paymentOrderMapper.toDTO(order);
	}

	private String createStripePaymentLink(String customerUserEmail, PaymentOrder order)  {
		try {
			Stripe.apiKey = stripeSecretKey;
			SessionCreateParams params = SessionCreateParams.builder()
					.addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
					.setMode(SessionCreateParams.Mode.PAYMENT).setSuccessUrl(successUrl + "/" + order.getId())
					.setCancelUrl(cancelUrl)
					.addLineItem(SessionCreateParams.LineItem.builder().setQuantity(1L)
							.setPriceData(SessionCreateParams.LineItem.PriceData.builder().setCurrency("usd")
									.setUnitAmount(order.getAmount().multiply(BigDecimal.valueOf(100)).longValue())
									.setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
											.setName("Salon Booking #" + order.getId()).build())
									.build())
							.build())
					.setCustomerEmail(customerUserEmail).putMetadata("orderId", order.getId().toString()).build();
			Session session = Session.create(params);
			order.setSessionId(session.getId());
			paymentOrderRepository.save(order);
			return session.getUrl();
		}catch(StripeException exception) {
			throw new PaymentException("Error while creating Payment link.",exception);
		}
	}

}