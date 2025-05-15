package com.kandarp.salon.user.mapper;

import java.util.List;

import org.keycloak.representations.idm.UserRepresentation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import com.kandarp.salon.shared.user.constant.Gender;
import com.kandarp.salon.shared.user.dto.UserDto;

@Mapper
public interface UserMapper {

    UserMapper MAPPER = Mappers.getMapper(UserMapper.class);

    @Mapping(source = "id", target = "userId")
    @Mapping(source = "username", target = "userName")
    @Mapping(source = "attributes.gender", target = "gender", qualifiedByName = "mapGender")
    UserDto userRepresentationToUserDto(UserRepresentation userRepresentation);

    @Named("mapGender")
    default Gender mapGender(List<String> genderList) {
        if (genderList == null || genderList.isEmpty()) {
            return Gender.FEMALE; // Default value
        }
        String genderStr = genderList.get(0).toUpperCase();
        try {
            return Gender.valueOf(genderStr);
        } catch (IllegalArgumentException e) {
            return Gender.FEMALE; // Fallback to default if invalid
        }
    }
}