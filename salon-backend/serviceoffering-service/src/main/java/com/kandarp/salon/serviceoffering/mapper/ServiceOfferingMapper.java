package com.kandarp.salon.serviceoffering.mapper;

import com.kandarp.salon.serviceoffering.entity.ServiceOffering;
import com.kandarp.salon.shared.serviceoffering.dto.ServiceOfferingRequestDto;
import com.kandarp.salon.shared.serviceoffering.dto.ServiceOfferingResponseDto;
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
    ServiceOffering toEntity(ServiceOfferingRequestDto dto);

    @Mapping(source = "image", target = "image", qualifiedByName = "prependImageUrlPrefix")
    ServiceOfferingResponseDto toDto(ServiceOffering entity, @Context String imageUrlPrefix);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "salonId", ignore = true)
    @Mapping(target = "image", ignore = true)
    void updateEntityFromDto(ServiceOfferingRequestDto dto, @MappingTarget ServiceOffering entity);

    @Named("prependImageUrlPrefix")
    default String prependImageUrlPrefix(String image, @Context String imageUrlPrefix) {
        if (image == null || image.isBlank()) {
            return null;
        }
        return imageUrlPrefix + image;
    }
}