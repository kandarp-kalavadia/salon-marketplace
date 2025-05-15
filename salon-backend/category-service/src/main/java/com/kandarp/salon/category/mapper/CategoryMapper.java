package com.kandarp.salon.category.mapper;

import com.kandarp.salon.category.entity.Category;
import com.kandarp.salon.shared.category.dto.CategoryRequestDto;
import com.kandarp.salon.shared.category.dto.CategoryResponseDto;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "salonId", ignore = true)
    @Mapping(target = "image", ignore = true)
    Category toEntity(CategoryRequestDto dto);

    @Mapping(source = "image", target = "image", qualifiedByName = "prependImageUrlPrefix")
    CategoryResponseDto toDto(Category entity, @Context String imageUrlPrefix);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "salonId", ignore = true)
    @Mapping(target = "image", ignore = true)
    void updateEntityFromDto(CategoryRequestDto dto, @MappingTarget Category entity);

    @Named("prependImageUrlPrefix")
    default String prependImageUrlPrefix(String image, @Context String imageUrlPrefix) {
        if (image == null || image.isBlank()) {
            return null;
        }
        return imageUrlPrefix + image;
    }
}