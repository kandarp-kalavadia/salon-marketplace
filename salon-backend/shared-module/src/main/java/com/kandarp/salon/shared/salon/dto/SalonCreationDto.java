package com.kandarp.salon.shared.salon.dto;

import java.time.LocalTime;

import com.kandarp.salon.shared.user.dto.UserCreationDto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SalonCreationDto {

    @NotBlank(message = "Salon name is required")
    @Size(min = 2, max = 100, message = "Salon name must be 2 to 100 characters long")
    private String salonName;

    @NotNull(message = "Open time is required")
    private LocalTime openTime;

    @NotNull(message = "Close time is required")
    private LocalTime closeTime;

    @NotBlank(message = "Address is required")
    @Size(min = 5, max = 255, message = "Address must be 5 to 255 characters long")
    private String address;

    @Size(max = 100, message = "Landmark must not exceed 100 characters")
    private String landmark;

    @NotBlank(message = "City is required")
    @Size(min = 2, max = 100, message = "City must be 2 to 100 characters long")
    private String city;

    @NotBlank(message = "State is required")
    @Size(min = 2, max = 100, message = "State must be 2 to 100 characters long")
    private String state;

    @NotBlank(message = "Zipcode is required")
    @Pattern(regexp = "^\\d{5}(-\\d{4})?$", message = "Zipcode must be a valid US zipcode")
    private String zipcode;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be a valid email address")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    private String email;

    @NotBlank(message = "Contact number is required")
    @Pattern(regexp = "^\\+?\\d{10}$", message = "Contact number must be a valid 10-digit phone number")
    private String contactNumber;

    @NotNull(message = "User details are required")
    private UserCreationDto user;

   
}