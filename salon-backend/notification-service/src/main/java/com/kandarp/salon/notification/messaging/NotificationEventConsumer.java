package com.kandarp.salon.notification.messaging;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import com.kandarp.salon.notification.dto.NotificationRequestDto;
import com.kandarp.salon.notification.service.NotificationService;
import com.kandarp.salon.shared.constant.Messaging;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class NotificationEventConsumer {


    private final NotificationService notificationService;

    @RabbitListener(queues = Messaging.USER_QUEUE)
    public void handleUserNotificationEvent(NotificationRequestDto notificationRequestDto) {
        notificationService.createNotification(notificationRequestDto);
    }
    
    @RabbitListener(queues = Messaging.SALON_QUEUE)
    public void handleSalonNotificationEvent(NotificationRequestDto notificationRequestDto) {
        notificationService.createNotification(notificationRequestDto);
    }
}