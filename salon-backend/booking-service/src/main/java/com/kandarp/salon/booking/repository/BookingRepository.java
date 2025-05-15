package com.kandarp.salon.booking.repository;

import com.kandarp.salon.booking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
	
	List<Booking> findByCustomerUserId(String customerUserId);

	List<Booking> findBySalonId(Long salonId);
}