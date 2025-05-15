package com.kandarp.salon.payment.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.kandarp.salon.payment.entity.PaymentOrder;
import com.kandarp.salon.shared.payment.dto.PaymentOrderDto;

@Mapper(componentModel = "spring")
public interface PaymentOrderMapper {
    PaymentOrderDto toDTO(PaymentOrder entity);
    
    
    @Mapping(target = "sessionId", ignore = true)
    PaymentOrder toEntity(PaymentOrderDto dto);
}