package com.kandarp.salon.notification.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequestDto {

    @NotBlank(message = "Type is required")
    private String type;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "User ID is required")
    private String userId;

    @NotNull(message = "Booking ID is required")
    private Long bookingId;

    @NotNull(message = "Salon ID is required")
    private Long salonId;

    
}