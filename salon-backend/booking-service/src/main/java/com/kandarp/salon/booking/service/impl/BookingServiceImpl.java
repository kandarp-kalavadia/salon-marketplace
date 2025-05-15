package com.kandarp.salon.booking.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kandarp.salon.booking.entity.Booking;
import com.kandarp.salon.booking.mapper.BookingMapper;
import com.kandarp.salon.booking.messaging.NotificationEventProducer;
import com.kandarp.salon.booking.repository.BookingRepository;
import com.kandarp.salon.booking.service.BookingService;
import com.kandarp.salon.booking.service.client.PaymentServiceClient;
import com.kandarp.salon.booking.service.client.SalonServiceClient;
import com.kandarp.salon.booking.service.client.ServiceOfferingServiceClient;
import com.kandarp.salon.booking.service.client.UserServiceClient;
import com.kandarp.salon.notification.dto.NotificationRequestDto;
import com.kandarp.salon.payment.dto.PaymentLinkResponseDto;
import com.kandarp.salon.shared.booking.constant.BookingStatus;
import com.kandarp.salon.shared.booking.dto.BookingRequestDto;
import com.kandarp.salon.shared.booking.dto.BookingResponseDto;
import com.kandarp.salon.shared.booking.dto.SalonBookingReportDto;
import com.kandarp.salon.shared.constant.NotificationType;
import com.kandarp.salon.shared.exception.ValidationException;
import com.kandarp.salon.shared.payment.dto.PaymentOrderRequestDto;
import com.kandarp.salon.shared.salon.dto.SalonResponseDto;
import com.kandarp.salon.shared.serviceoffering.dto.ServiceOfferingResponseDto;
import com.kandarp.salon.shared.user.dto.UserDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

	private final BookingRepository bookingRepository;

	private final BookingMapper bookingMapper;

	private final SalonServiceClient salonServiceClient;
	private final ServiceOfferingServiceClient serviceOfferingServiceClient;
	private final UserServiceClient userServiceClient;
	private final PaymentServiceClient paymentServiceClient;
	private final NotificationEventProducer notificationEventProducer;


	@Override
	@Transactional
	public PaymentLinkResponseDto createBooking(String customerUserId, BookingRequestDto dto) {

		// Validate customer
		ResponseEntity<UserDto> customerResponse = userServiceClient.getUserByUserId(customerUserId);
		UserDto customer = customerResponse.getBody();

		// Fetch services
		ResponseEntity<List<ServiceOfferingResponseDto>> response = serviceOfferingServiceClient
				.getServiceOfferingByIds(dto.getServiceIds());
		List<ServiceOfferingResponseDto> services = response.getBody();

		if (services.size() != dto.getServiceIds().size()) {
			throw new ValidationException("One or more service IDs are invalid");
		}

		// Verify all services belong to the same salon
		Long salonId = services.stream().map(ServiceOfferingResponseDto::getSalonId).distinct().findFirst()
				.orElseThrow(() -> new ValidationException("No services provided"));
		if (services.stream().anyMatch(service -> !service.getSalonId().equals(salonId))) {
			throw new ValidationException("All services must belong to the same salon");
		}

		// Fetch salon
		ResponseEntity<SalonResponseDto> salonResponse = salonServiceClient.getSalonById(salonId);
		SalonResponseDto salon = salonResponse.getBody();

		// Calculate total duration and price
		long totalDurationMinutes = services.stream().mapToLong(service -> service.getDuration().toMinutes()).sum();
		BigDecimal totalPrice = services.stream().map(ServiceOfferingResponseDto::getPrice).reduce(BigDecimal.ZERO,
				BigDecimal::add);

		// Calculate end time
		LocalDateTime startTime = dto.getStartTime();
		LocalDateTime endTime = startTime.plusMinutes(totalDurationMinutes);

		// Validate time slot
		validateTimeSlot(salon, startTime, endTime);

		// Create booking
		Booking booking = bookingMapper.toEntity(dto);
		booking.setSalonId(salonId);
		booking.setCustomerUserId(customerUserId);
		booking.setEndTime(endTime);
		booking.setTotalPrice(totalPrice);
		booking.setStatus(BookingStatus.PENDING);

		Booking saved = bookingRepository.save(booking);

		// Create payment link
		PaymentOrderRequestDto paymentRequestDto = new PaymentOrderRequestDto();
		paymentRequestDto.setBookingId(saved.getId());
		paymentRequestDto.setCustomerUserId(customer.getUserId());
		paymentRequestDto.setSalonId(salonId);
		paymentRequestDto.setTotalAmount(totalPrice);
		paymentRequestDto.setPaymentMethod(dto.getPaymentMethod());
		paymentRequestDto.setCustomerUserEmail(customer.getEmail());

		ResponseEntity<PaymentLinkResponseDto> paymentResponse = paymentServiceClient
				.createPaymentLink(paymentRequestDto);
		return paymentResponse.getBody();
	}

	@Override
	public BookingResponseDto getBookingById(Long id) {
		Booking booking = bookingRepository.findById(id).orElseThrow();
		return buildResponseDto(booking);
	}

	@Override
	public List<BookingResponseDto> getBookingsByCustomer(String customerUserId) {
		List<Booking> bookings = bookingRepository.findByCustomerUserId(customerUserId);
		return bookings.stream().map(this::buildResponseDto).collect(Collectors.toList());
	}

	@Override
	public List<BookingResponseDto> getBookingsBySalon(String ownerUserId) {
		// Verify salon ownership
		ResponseEntity<SalonResponseDto> salonResponse = salonServiceClient.getSalonByOwnerId(ownerUserId);
		SalonResponseDto salon = salonResponse.getBody();

		List<Booking> bookings = bookingRepository.findBySalonId(salon.getSalonId());
		return bookings.stream().map(this::buildResponseDto).collect(Collectors.toList());
	}

	@Override
	public List<BookingResponseDto> getBookingsByDate(LocalDate date, String ownerUserId) {
		// Verify salon ownership
		ResponseEntity<SalonResponseDto> salonResponse = salonServiceClient.getSalonByOwnerId(ownerUserId);
		SalonResponseDto salon = salonResponse.getBody();

		List<Booking> bookings = bookingRepository.findBySalonId(salon.getSalonId());
		if (date == null) {
			return bookings.stream().map(this::buildResponseDto).collect(Collectors.toList());
		}

		return bookings.stream()
				.filter(booking -> booking.getStartTime().toLocalDate().isEqual(date)
						|| booking.getEndTime().toLocalDate().isEqual(date))
				.map(this::buildResponseDto).collect(Collectors.toList());
	}

	@Override
	public BookingResponseDto updateBookingStatus(Long id, BookingStatus status, String ownerUserId) {
		Booking booking = bookingRepository.findById(id).orElseThrow();

		// Verify salon ownership
		ResponseEntity<SalonResponseDto> salonResponse = salonServiceClient.getSalonById(booking.getSalonId());
		SalonResponseDto salon = salonResponse.getBody();

		if (!salon.getUser().getUserId().equals(ownerUserId)) {
			throw new AuthorizationDeniedException("You are not authorized to update this booking");
		}

		booking.setStatus(status);
		Booking updated = bookingRepository.save(booking);
		return buildResponseDto(updated);
	}

	@Override
	public void confirmBooking(Long id) {
		Booking booking = bookingRepository.findById(id).orElseThrow();

		if (booking.getStatus() != BookingStatus.PENDING) {
			return;
		}

		booking.setStatus(BookingStatus.CONFIRMED);
		Booking updated = bookingRepository.save(booking);
		
		notificationEventProducer.sendUserNotificationEvent(getUserNotificarionDto(updated));
		notificationEventProducer.sendSalonNotificationEvent(getSalonNotificarionDto(updated));

	}

	@Override
	public SalonBookingReportDto getSalonBookingReport(String ownerUserId) {
		// Verify salon ownership
		ResponseEntity<SalonResponseDto> salonResponse = salonServiceClient.getSalonByOwnerId(ownerUserId);
		SalonResponseDto salon = salonResponse.getBody();

		List<Booking> bookings = bookingRepository.findBySalonId(salon.getSalonId());

		SalonBookingReportDto report = new SalonBookingReportDto();
		report.setTotalEarnings(
				bookings.stream().map(Booking::getTotalPrice).map(BigDecimal::doubleValue).reduce(0.0, Double::sum));
		report.setTotalBookings(bookings.size());
		report.setCancelledBookings(
				(int) bookings.stream().filter(booking -> booking.getStatus() == BookingStatus.CANCELLED).count());
		report.setTotalRefund(bookings.stream().filter(booking -> booking.getStatus() == BookingStatus.CANCELLED)
				.map(Booking::getTotalPrice).map(BigDecimal::doubleValue).reduce(0.0, Double::sum));

		return report;
	}

	private void validateTimeSlot(SalonResponseDto salon, LocalDateTime startTime, LocalDateTime endTime) {
		LocalDateTime salonOpenTime = LocalDateTime.of(startTime.toLocalDate(), salon.getOpenTime());
		LocalDateTime salonCloseTime = LocalDateTime.of(startTime.toLocalDate(), salon.getCloseTime());

		if (startTime.isBefore(salonOpenTime) || endTime.isAfter(salonCloseTime)) {
			throw new ValidationException("Booking time must be within salon's open hours: "
					+ salonOpenTime.toLocalTime() + " to " + salonCloseTime.toLocalTime());
		}

		List<Booking> existingBookings = bookingRepository.findBySalonId(salon.getSalonId());
		for (Booking existing : existingBookings) {
			if ((startTime.isBefore(existing.getEndTime()) && endTime.isAfter(existing.getStartTime()))
					|| startTime.equals(existing.getStartTime()) || endTime.equals(existing.getEndTime())) {
				throw new ValidationException("Time slot is not available");
			}
		}
	}

	private BookingResponseDto buildResponseDto(Booking booking) {
		// Fetch salon
		ResponseEntity<SalonResponseDto> salonResponse = salonServiceClient.getSalonById(booking.getSalonId());
		SalonResponseDto salon = salonResponse.getBody();

		// Fetch customer
		ResponseEntity<UserDto> customerResponse = userServiceClient.getUserByUserId(booking.getCustomerUserId());
		UserDto customer = customerResponse.getBody();

		// Fetch services
		ResponseEntity<List<ServiceOfferingResponseDto>> response = serviceOfferingServiceClient
				.getServiceOfferingByIds(booking.getServiceIds());
		List<ServiceOfferingResponseDto> services = response.getBody();

		// Build response
		BookingResponseDto responseDto = bookingMapper.toDTO(booking);
		responseDto.setSalon(salon);
		responseDto.setCustomer(customer);
		responseDto.setServices(services);
		return responseDto;
	}
	
	private NotificationRequestDto getUserNotificarionDto(Booking booking) {
		NotificationRequestDto notificationRequestDto = new NotificationRequestDto();
		notificationRequestDto.setType(NotificationType.NOTIFICATION_TYPE_BOOKING);
		notificationRequestDto.setDescription("You booking confirmed");
		notificationRequestDto.setBookingId(booking.getId());
		notificationRequestDto.setSalonId(null);
		notificationRequestDto.setUserId(booking.getCustomerUserId());
		return notificationRequestDto;
	}
	
	private NotificationRequestDto getSalonNotificarionDto(Booking booking) {
		NotificationRequestDto notificationRequestDto = new NotificationRequestDto();
		notificationRequestDto.setType(NotificationType.NOTIFICATION_TYPE_BOOKING);
		notificationRequestDto.setDescription("New booking confirmed");
		notificationRequestDto.setBookingId(booking.getId());
		notificationRequestDto.setSalonId(booking.getSalonId());
		notificationRequestDto.setUserId(null);
		return notificationRequestDto;
	}
}