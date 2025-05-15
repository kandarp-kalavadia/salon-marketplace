package com.kandarp.salon.shared.salon.dto;

import com.kandarp.salon.shared.user.dto.UserDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SalonResponseDto {

	private Long salonId;
	private String salonName;
	private boolean active;
	private LocalTime openTime;
	private LocalTime closeTime;
	private String address;
	private String landmark;
	private String city;
	private String state;
	private String zipcode;
	private String email;
	private String contactNumber;
	private List<String> salonImages;
	private UserDto user;

}