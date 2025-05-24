package com.kandarp.salon.service;

import java.nio.file.Path;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import com.kandarp.salon.shared.salon.dto.SalonCreationDto;
import com.kandarp.salon.shared.salon.dto.SalonRequestDto;
import com.kandarp.salon.shared.salon.dto.SalonResponseDto;

public interface SalonService {

	SalonResponseDto createSalon(SalonCreationDto dto, MultipartFile[] images);

	SalonResponseDto getSalonById(Long id);

	List<SalonResponseDto> getAllSalons();

	SalonResponseDto getSalonByOwnerId(String ownerId);

	SalonResponseDto updateSalon(Long id, String userId, SalonRequestDto dto, MultipartFile[] images);

	void deleteSalon(Long id, String userId);

	ResponseEntity<Resource> getImage(String filename);

	Path resolveUploadPath();

	List<SalonResponseDto> searchSalons(String query);

}
