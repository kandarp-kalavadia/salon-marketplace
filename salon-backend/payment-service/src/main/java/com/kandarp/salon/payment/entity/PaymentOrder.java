package com.kandarp.salon.payment.entity;

import java.math.BigDecimal;

import com.kandarp.salon.shared.payment.constant.PaymentMethod;
import com.kandarp.salon.shared.payment.constant.PaymentOrderStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "payment_orders")
public class PaymentOrder {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private BigDecimal amount;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private PaymentOrderStatus status = PaymentOrderStatus.PENDING;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private PaymentMethod paymentMethod;

	private String sessionId; // New field for Stripe session ID

	@Column(nullable = false)
	private String customerUserId;

	@Column(nullable = false)
	private Long bookingId;

	@Column(nullable = false)
	private Long salonId;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public BigDecimal getAmount() {
		return amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}

	public PaymentOrderStatus getStatus() {
		return status;
	}

	public void setStatus(PaymentOrderStatus status) {
		this.status = status;
	}

	public PaymentMethod getPaymentMethod() {
		return paymentMethod;
	}

	public void setPaymentMethod(PaymentMethod paymentMethod) {
		this.paymentMethod = paymentMethod;
	}

	public String getSessionId() {
		return sessionId;
	}

	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}

	public String getCustomerUserId() {
		return customerUserId;
	}

	public void setCustomerUserId(String customerUserId) {
		this.customerUserId = customerUserId;
	}

	public Long getBookingId() {
		return bookingId;
	}

	public void setBookingId(Long bookingId) {
		this.bookingId = bookingId;
	}

	public Long getSalonId() {
		return salonId;
	}

	public void setSalonId(Long salonId) {
		this.salonId = salonId;
	}

}