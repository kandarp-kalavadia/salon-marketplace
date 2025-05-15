package com.kandarp.salon.serviceoffering.entity;
import java.math.BigDecimal;
import java.time.Duration;

import jakarta.persistence.*;
import lombok.Data;


@Entity
@Data
public class ServiceOffering {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    private BigDecimal price;

    private Duration duration;

    private Long salonId;
    
    private Long categoryId;

    private boolean available;

    private String image;

}