package com.kandarp.salon.booking.messaging;


import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import com.kandarp.salon.booking.service.BookingService;
import com.kandarp.salon.shared.constant.Messaging;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class BookingEventConsumer {


    private final BookingService bookingService;

    @RabbitListener(queues = Messaging.BOOKING_QUEUE)
    public void bookingUpdateListener(Long bookingId){
        bookingService.confirmBooking(bookingId);
    }
}