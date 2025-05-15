package com.kandarp.salon.serviceoffering.service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.kandarp.salon.serviceoffering.entity.ServiceOffering;
import com.kandarp.salon.serviceoffering.mapper.ServiceOfferingMapper;
import com.kandarp.salon.serviceoffering.repository.ServiceOfferingRepository;
import com.kandarp.salon.serviceoffering.service.ServiceOfferingService;
import com.kandarp.salon.serviceoffering.service.client.CategoryServiceClient;
import com.kandarp.salon.serviceoffering.service.client.SalonServiceClient;
import com.kandarp.salon.shared.category.dto.CategoryResponseDto;
import com.kandarp.salon.shared.salon.dto.SalonResponseDto;
import com.kandarp.salon.shared.serviceoffering.dto.ServiceOfferingRequestDto;
import com.kandarp.salon.shared.serviceoffering.dto.ServiceOfferingResponseDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServiceOfferingServiceImpl implements ServiceOfferingService {

	private final ServiceOfferingRepository repository;
	private final SalonServiceClient salonServiceClient;
	private final CategoryServiceClient categoryServiceClient;
	private final ServiceOfferingMapper mapper;

	@Value("${salon.service-offering.image.upload-dir}")
	private String uploadDir;

	@Value("${salon.service-offering.image.url-prefix}")
	private String imageUrlPrefix;

	@Override
	public ServiceOfferingResponseDto createServiceOffering(String ownerUserId, ServiceOfferingRequestDto dto,
			MultipartFile image) {

		ResponseEntity<SalonResponseDto> salonDtoResponse = salonServiceClient.getSalonByOwnerId(ownerUserId);

		ResponseEntity<CategoryResponseDto> categoryDtoResponse = categoryServiceClient.getCategoryById(dto.getCategoryId());

		String imagePath = null;
		if (image != null && !image.isEmpty()) {
			imagePath = uploadImage(image);
		}

		ServiceOffering serviceOffering = mapper.toEntity(dto);
		serviceOffering.setSalonId(salonDtoResponse.getBody().getSalonId());
		serviceOffering.setCategoryId(categoryDtoResponse.getBody().getId());
		serviceOffering.setImage(imagePath);

		ServiceOffering saved = repository.save(serviceOffering);
		return mapper.toDto(saved, imageUrlPrefix);
	}

	@Override
	public ServiceOfferingResponseDto updateServiceOffering(Long id, String ownerUserId, ServiceOfferingRequestDto dto,
			MultipartFile image) {

		ServiceOffering entity = repository.findById(id).orElseThrow();

		ResponseEntity<SalonResponseDto> salonDtoResponse = salonServiceClient.getSalonById(entity.getSalonId());

		String salonOwnerUserId = salonDtoResponse.getBody().getUser().getUserId();
		if (!salonOwnerUserId.equals(ownerUserId)) {
			throw new AuthorizationDeniedException("You are not authorized to update this service offering");
		}

		categoryServiceClient.getCategoryById(dto.getCategoryId());

		mapper.updateEntityFromDto(dto, entity);

		if (image != null && !image.isEmpty()) {
			if (entity.getImage() != null) {
				removeImage(entity.getImage());
			}
			String newImagePath = uploadImage(image);
			entity.setImage(newImagePath);
		}

		ServiceOffering updated = repository.save(entity);
		return mapper.toDto(updated, imageUrlPrefix);
	}

	@Override
	public void deleteServiceOffering(Long id, String ownerUserId) {
		ServiceOffering entity = repository.findById(id).orElseThrow();

		ResponseEntity<SalonResponseDto> salonDtoResponse = salonServiceClient.getSalonById(entity.getSalonId());

		String salonOwnerUserId = salonDtoResponse.getBody().getUser().getUserId();
		if (!salonOwnerUserId.equals(ownerUserId)) {
			throw new AuthorizationDeniedException("You are not authorized to delete this service offering");
		}

		if (entity.getImage() != null) {
			removeImage(entity.getImage());
		}

		repository.delete(entity);
	}

	@Override
	public ServiceOfferingResponseDto getServiceOfferingById(Long id) {
		ServiceOffering entity = repository.findById(id).orElseThrow();
		return mapper.toDto(entity, imageUrlPrefix);
	}
	
	@Override
	public List<ServiceOfferingResponseDto> getServiceOfferingByIds(Set<Long> ids) {
		return repository.findAllById(ids).stream().map(entity -> mapper.toDto(entity, imageUrlPrefix))
				.collect(Collectors.toList());
	}

	@Override
	public List<ServiceOfferingResponseDto> getAllServiceOfferings() {
		return repository.findAll().stream().map(entity -> mapper.toDto(entity, imageUrlPrefix))
				.collect(Collectors.toList());
	}

	@Override
	public List<ServiceOfferingResponseDto> getServiceOfferingsBySalonId(Long salonId) {
		return repository.findBySalonId(salonId).stream().map(entity -> mapper.toDto(entity, imageUrlPrefix))
				.collect(Collectors.toList());
	}

	@Override
	public List<ServiceOfferingResponseDto> getServiceOfferingsByCategoryId(Long categoryId) {
		return repository.findByCategoryId(categoryId).stream().map(entity -> mapper.toDto(entity, imageUrlPrefix))
				.collect(Collectors.toList());
	}


	@Override
	public ResponseEntity<Resource> getImage(String filename) {
		try {
			Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
			Resource resource = new UrlResource(filePath.toUri());

			if (resource.exists() && resource.isReadable()) {
				String contentType = determineContentType(filename);
				return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType))
						.header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
						.body(resource);
			} else {
				return ResponseEntity.notFound().build();
			}
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(null);
		}
	}

	private String uploadImage(MultipartFile image) {
		if (image == null || image.isEmpty() || !image.getContentType().startsWith("image/")) {
			throw new IllegalArgumentException("Invalid image file");
		}
		String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
		try {
			Path uploadPath = Paths.get(uploadDir);
			if (!Files.exists(uploadPath)) {
				Files.createDirectories(uploadPath);
			}
			Path filePath = uploadPath.resolve(fileName);
			Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
			return fileName;
		} catch (IOException e) {
			throw new RuntimeException("Failed to save image: " + fileName, e);
		}
	}

	private void removeImage(String fileName) {
		if (fileName == null || fileName.isBlank()) {
			return;
		}
		try {
			Path filePath = Paths.get(uploadDir).resolve(fileName);
			Files.deleteIfExists(filePath);
		} catch (IOException e) {
			throw new RuntimeException("Failed to delete image: " + fileName, e);
		}
	}

	private String determineContentType(String filename) {
		if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) {
			return MediaType.IMAGE_JPEG_VALUE;
		} else if (filename.endsWith(".png")) {
			return MediaType.IMAGE_PNG_VALUE;
		} else if (filename.endsWith(".gif")) {
			return MediaType.IMAGE_GIF_VALUE;
		} else {
			return MediaType.APPLICATION_OCTET_STREAM_VALUE;
		}
	}

}
