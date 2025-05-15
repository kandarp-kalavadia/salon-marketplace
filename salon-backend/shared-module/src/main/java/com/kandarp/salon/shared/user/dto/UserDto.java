package com.kandarp.salon.shared.user.dto;

import com.kandarp.salon.shared.user.constant.Gender;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private String userId;
    private String firstName;
    private String lastName;
    private String userName;
    private String email;
    private Gender gender;

}
