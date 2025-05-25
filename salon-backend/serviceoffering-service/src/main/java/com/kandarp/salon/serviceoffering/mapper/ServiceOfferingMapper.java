package com.kandarp.salon.serviceoffering.mapper;

import com.kandarp.salon.serviceoffering.entity.ServiceOffering;
import com.kandarp.salon.shared.serviceoffering.dto.ServiceOfferingRequestDto;
import com.kandarp.salon.shared.serviceoffering.dto.ServiceOfferingResponseDto;

import java.time.Duration;

import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface ServiceOfferingMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "salonId", ignore = true)
    @Mapping(target = "image", ignore = true)
    @Mapping(source = "duration", target = "duration",qualifiedByName = "longToDuration")
    ServiceOffering toEntity(ServiceOfferingRequestDto dto);

    @Mapping(source = "image", target = "image", qualifiedByName = "prependImageUrlPrefix")
    @Mapping(source = "duration", target = "duration",qualifiedByName = "durationToLong")
    ServiceOfferingResponseDto toDto(ServiceOffering entity, @Context String imageUrlPrefix);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "salonId", ignore = true)
    @Mapping(target = "image", ignore = true)
    @Mapping(source = "duration", target = "duration",qualifiedByName = "longToDuration")
    void updateEntityFromDto(ServiceOfferingRequestDto dto, @MappingTarget ServiceOffering entity);
    
    
    @Named("longToDuration")
    default Duration durationToLong(long duration) {
        return Duration.ofMinutes(duration);
    }
    
    @Named("durationToLong")
    default long durationToLong(Duration duration) {
        if (duration == null ) {
            return 0;
        }
        return duration.toMinutes();
    }

    @Named("prependImageUrlPrefix")
    default String prependImageUrlPrefix(String image, @Context String imageUrlPrefix) {
        if (image == null || image.isBlank()) {
            return null;
        }
        return imageUrlPrefix + image;
    }
}