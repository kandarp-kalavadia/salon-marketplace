package com.kandarp.salon.shared.serviceoffering.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ServiceOfferingRequestDto {
    private String name;
    private String description;
    private BigDecimal price;
    private long duration;
    private Long categoryId;
    private boolean available;

   
}