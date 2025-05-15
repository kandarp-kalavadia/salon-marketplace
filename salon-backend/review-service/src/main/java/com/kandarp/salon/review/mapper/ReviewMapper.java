package com.kandarp.salon.review.mapper;

import com.kandarp.salon.review.entity.Review;
import com.kandarp.salon.shared.review.dto.ReviewRequestDto;
import com.kandarp.salon.shared.review.dto.ReviewResponseDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ReviewMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Review toEntity(ReviewRequestDto dto);

    @Mapping(target = "salon", ignore = true)
    @Mapping(target = "user", ignore = true)
    ReviewResponseDto toDto(Review entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "salonId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateEntityFromDto(ReviewRequestDto dto, @MappingTarget Review entity);
}