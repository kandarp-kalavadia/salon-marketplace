package com.kandarp.salon.serviceoffering.service;

import java.util.List;
import java.util.Set;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import com.kandarp.salon.shared.serviceoffering.dto.ServiceOfferingRequestDto;
import com.kandarp.salon.shared.serviceoffering.dto.ServiceOfferingResponseDto;

public interface ServiceOfferingService {

	ServiceOfferingResponseDto createServiceOffering(String ownerUserId, ServiceOfferingRequestDto dto,
			MultipartFile image);

	ServiceOfferingResponseDto getServiceOfferingById(Long id);

	List<ServiceOfferingResponseDto> getAllServiceOfferings();

	List<ServiceOfferingResponseDto> getServiceOfferingsBySalonId(Long salonId);

	List<ServiceOfferingResponseDto> getServiceOfferingsByCategoryId(Long categoryId);

	ServiceOfferingResponseDto updateServiceOffering(Long id, String ownerUserId, ServiceOfferingRequestDto dto,
			MultipartFile image);

	void deleteServiceOffering(Long id, String ownerUserId);

	ResponseEntity<Resource> getImage(String filename);

	List<ServiceOfferingResponseDto> getServiceOfferingByIds(Set<Long> ids);

}
