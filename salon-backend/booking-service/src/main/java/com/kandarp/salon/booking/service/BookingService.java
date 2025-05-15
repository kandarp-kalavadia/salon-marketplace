package com.kandarp.salon.booking.service;

import java.time.LocalDate;
import java.util.List;

import com.kandarp.salon.payment.dto.PaymentLinkResponseDto;
import com.kandarp.salon.shared.booking.constant.BookingStatus;
import com.kandarp.salon.shared.booking.dto.BookingRequestDto;
import com.kandarp.salon.shared.booking.dto.BookingResponseDto;
import com.kandarp.salon.shared.booking.dto.SalonBookingReportDto;

public interface BookingService {
	PaymentLinkResponseDto createBooking(String customerUserId, BookingRequestDto dto);

	BookingResponseDto getBookingById(Long id);

	List<BookingResponseDto> getBookingsByCustomer(String customerUserId);

	BookingResponseDto updateBookingStatus(Long id, BookingStatus status, String ownerUserId);

	void confirmBooking(Long id);

	List<BookingResponseDto> getBookingsBySalon(String ownerUserId);

	SalonBookingReportDto getSalonBookingReport(String ownerUserId);

	List<BookingResponseDto> getBookingsByDate(LocalDate date, String ownerUserId);
}
