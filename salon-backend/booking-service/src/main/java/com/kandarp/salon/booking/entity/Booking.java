package com.kandarp.salon.booking.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

import com.kandarp.salon.shared.booking.constant.BookingStatus;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "bookings")
public class Booking {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private Long salonId;

	@Column(nullable = false)
	private String customerUserId;

	@Column(nullable = false)
	private LocalDateTime startTime;

	@Column(nullable = false)
	private LocalDateTime endTime;

	@ElementCollection
	@CollectionTable(name = "booking_services", joinColumns = @JoinColumn(name = "booking_id"))
	@Column(name = "service_id")
	private Set<Long> serviceIds;

	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	private BookingStatus status;

	@Column(nullable = false)
	private BigDecimal totalPrice;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getSalonId() {
		return salonId;
	}

	public void setSalonId(Long salonId) {
		this.salonId = salonId;
	}

	public String getCustomerUserId() {
		return customerUserId;
	}

	public void setCustomerUserId(String customerUserId) {
		this.customerUserId = customerUserId;
	}

	public LocalDateTime getStartTime() {
		return startTime;
	}

	public void setStartTime(LocalDateTime startTime) {
		this.startTime = startTime;
	}

	public LocalDateTime getEndTime() {
		return endTime;
	}

	public void setEndTime(LocalDateTime endTime) {
		this.endTime = endTime;
	}

	public Set<Long> getServiceIds() {
		return serviceIds;
	}

	public void setServiceIds(Set<Long> serviceIds) {
		this.serviceIds = serviceIds;
	}

	public BookingStatus getStatus() {
		return status;
	}

	public void setStatus(BookingStatus status) {
		this.status = status;
	}

	public BigDecimal getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(BigDecimal totalPrice) {
		this.totalPrice = totalPrice;
	}

}