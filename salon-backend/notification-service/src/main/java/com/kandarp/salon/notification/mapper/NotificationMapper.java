package com.kandarp.salon.notification.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.kandarp.salon.notification.dto.NotificationDto;
import com.kandarp.salon.notification.dto.NotificationRequestDto;
import com.kandarp.salon.notification.entity.Notification;

@Mapper(componentModel = "spring")
public interface NotificationMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "notificationRead", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Notification toEntity(NotificationRequestDto dto);

    NotificationDto toDTO(Notification entity);

}