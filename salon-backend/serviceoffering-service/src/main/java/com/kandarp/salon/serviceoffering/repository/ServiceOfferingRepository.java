package com.kandarp.salon.serviceoffering.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kandarp.salon.serviceoffering.entity.ServiceOffering;

public interface ServiceOfferingRepository extends JpaRepository<ServiceOffering, Long> {
	
	List<ServiceOffering> findBySalonId(Long salonId);
    List<ServiceOffering> findByCategoryId(Long categoryId);

}
