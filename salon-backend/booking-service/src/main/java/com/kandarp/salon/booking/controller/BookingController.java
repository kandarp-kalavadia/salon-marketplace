package com.kandarp.salon.booking.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kandarp.salon.booking.service.BookingService;
import com.kandarp.salon.payment.dto.PaymentLinkResponseDto;
import com.kandarp.salon.shared.booking.constant.BookingStatus;
import com.kandarp.salon.shared.booking.dto.BookingRequestDto;
import com.kandarp.salon.shared.booking.dto.BookingResponseDto;
import com.kandarp.salon.shared.booking.dto.SalonBookingReportDto;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
@SecurityRequirement(name = "Keycloak")
public class BookingController {

	private final BookingService bookingService;

	@PostMapping
	public ResponseEntity<PaymentLinkResponseDto> createBooking(@Valid @RequestBody BookingRequestDto requestDto,
			@AuthenticationPrincipal Jwt jwt) {
		PaymentLinkResponseDto paymentLinkResponseDto = bookingService.createBooking(jwt.getSubject(), requestDto);
		return new ResponseEntity<>(paymentLinkResponseDto, HttpStatus.CREATED);
	}

	@GetMapping("/{bookingId}")
	public ResponseEntity<BookingResponseDto> getBookingById(@PathVariable Long bookingId) {
		BookingResponseDto booking = bookingService.getBookingById(bookingId);
		return ResponseEntity.ok(booking);
	}

	@GetMapping("/customer")
	public ResponseEntity<List<BookingResponseDto>> getBookingsByCustomer(@AuthenticationPrincipal Jwt jwt) {
		List<BookingResponseDto> bookings = bookingService.getBookingsByCustomer(jwt.getSubject());
		return ResponseEntity.ok(bookings);
	}

	@GetMapping("/salon")
	public ResponseEntity<List<BookingResponseDto>> getBookingsBySalon(@AuthenticationPrincipal Jwt jwt) {
		List<BookingResponseDto> responseDtos = bookingService.getBookingsBySalon(jwt.getSubject());
		return ResponseEntity.ok(responseDtos);
	}

	@GetMapping("/report")
	public ResponseEntity<SalonBookingReportDto> getSalonReport(@AuthenticationPrincipal Jwt jwt) {
		SalonBookingReportDto report = bookingService.getSalonBookingReport(jwt.getSubject());
		return ResponseEntity.ok(report);
	}


	@PutMapping("/{bookingId}/status")
	public ResponseEntity<BookingResponseDto> updateBookingStatus(@PathVariable Long bookingId,
			@RequestParam BookingStatus status, @AuthenticationPrincipal Jwt jwt) {
		BookingResponseDto updatedBooking = bookingService.updateBookingStatus(bookingId, status, jwt.getSubject());
		return ResponseEntity.ok(updatedBooking);
	}

	@GetMapping("/booked-slots/{date}")
	public ResponseEntity<List<BookingResponseDto>> getBookedSlots(@PathVariable LocalDate date,
			@AuthenticationPrincipal Jwt jwt) {
		List<BookingResponseDto> bookings = bookingService.getBookingsByDate(date, jwt.getSubject());
		return ResponseEntity.ok(bookings);
	}
}