package com.kandarp.salon.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import com.kandarp.salon.entity.Salon;
import com.kandarp.salon.shared.salon.dto.SalonCreationDto;
import com.kandarp.salon.shared.salon.dto.SalonRequestDto;
import com.kandarp.salon.shared.salon.dto.SalonResponseDto;

@Mapper(componentModel = "spring")
public interface SalonMapper {

    @Mapping(target = "salonId", ignore = true)
    @Mapping(target = "ownerId", ignore = true)
    @Mapping(target = "salonImages", ignore = true)
    @Mapping(target = "active", expression = "java(true)")
    Salon toEntity(SalonCreationDto dto);

    @Mapping(target = "salonId", ignore = true)
    @Mapping(target = "ownerId", ignore = true)
    @Mapping(target = "salonImages", ignore = true)
    Salon toEntity(SalonRequestDto dto);

    @Mapping(source = "salonImages", target = "salonImages", qualifiedByName = "prependImageUrlPrefix")
    @Mapping(target = "user", ignore = true)
    SalonResponseDto toDto(Salon entity, @Context String imageUrlPrefix);

    @Mapping(target = "salonId", ignore = true)
    @Mapping(target = "ownerId", ignore = true)
    @Mapping(target = "salonImages", ignore = true)
    void updateEntityFromDto(SalonRequestDto dto, @MappingTarget Salon entity);

    @Named("prependImageUrlPrefix")
    default List<String> prependImageUrlPrefix(List<String> images, @Context String imageUrlPrefix) {
        if (images == null) {
            return null;
        }
        return images.stream()
                .filter(image -> image != null && !image.isBlank())
                .map(image -> imageUrlPrefix + image)
                .collect(Collectors.toList());
    }
}