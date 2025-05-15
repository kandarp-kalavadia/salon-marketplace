package com.kandarp.salon.booking.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.kandarp.salon.booking.entity.Booking;
import com.kandarp.salon.shared.booking.dto.BookingRequestDto;
import com.kandarp.salon.shared.booking.dto.BookingResponseDto;

@Mapper(componentModel = "spring")
public interface BookingMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "salonId", ignore = true)
    @Mapping(target = "customerUserId", ignore = true)
    @Mapping(target = "endTime", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "totalPrice", ignore = true)
    Booking toEntity(BookingRequestDto dto);

    @Mapping(target = "salon", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "services", ignore = true)
    BookingResponseDto toDTO(Booking entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "salonId", ignore = true)
    @Mapping(target = "customerUserId", ignore = true)
    @Mapping(target = "startTime", ignore = true)
    @Mapping(target = "endTime", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "serviceIds", ignore = true)
    @Mapping(target = "totalPrice", ignore = true)
    void updateEntityFromDTO(BookingRequestDto dto, @MappingTarget Booking entity);
}