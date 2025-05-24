package com.kandarp.salon.user.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kandarp.salon.shared.user.constant.UserRole;
import com.kandarp.salon.shared.user.dto.UserCreationDto;
import com.kandarp.salon.shared.user.dto.UserCreationResponseDto;
import com.kandarp.salon.shared.user.dto.UserDto;
import com.kandarp.salon.user.service.UserService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
@SecurityRequirement(name = "Keycloak")
public class UserController {

	private final UserService userService;

	@PostMapping(value="/signup")
	public ResponseEntity<UserCreationResponseDto> createCustomerUser(@Valid @RequestBody UserCreationDto userCreationDto) {
		String userId = userService.createUser(userCreationDto.getFirstName(), userCreationDto.getLastName(),
				userCreationDto.getUserName(), userCreationDto.getPassword(), userCreationDto.getEmail(),
				UserRole.CUSTOMER.name(), userCreationDto.getGender().getValue());
		return new ResponseEntity<UserCreationResponseDto>(new UserCreationResponseDto(userId), HttpStatus.CREATED);
	}
	
	@PostMapping("/salon/signup")
	public ResponseEntity<UserCreationResponseDto> createSalonOwnerUser(@Valid @RequestBody UserCreationDto userCreationDto) {
		String userId = userService.createUser(userCreationDto.getFirstName(), userCreationDto.getLastName(),
				userCreationDto.getUserName(), userCreationDto.getPassword(), userCreationDto.getEmail(),
				UserRole.SALON_OWNER.name(), userCreationDto.getGender().getValue());
		return new ResponseEntity<UserCreationResponseDto>(new UserCreationResponseDto(userId), HttpStatus.CREATED);
	}
	
	@GetMapping("/{userId}")
	public ResponseEntity<UserDto> getUserByUserId(@PathVariable String userId) {
		UserDto userDto = userService.getUserById(userId);
		return new ResponseEntity<UserDto>(userDto, HttpStatus.OK);
	}
	
	
}