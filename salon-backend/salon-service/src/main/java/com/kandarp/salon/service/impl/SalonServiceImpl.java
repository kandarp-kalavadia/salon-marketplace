package com.kandarp.salon.service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.kandarp.salon.entity.Salon;
import com.kandarp.salon.mapper.SalonMapper;
import com.kandarp.salon.repository.SalonRepository;
import com.kandarp.salon.service.SalonService;
import com.kandarp.salon.service.client.UserServiceClient;
import com.kandarp.salon.shared.salon.dto.SalonCreationDto;
import com.kandarp.salon.shared.salon.dto.SalonRequestDto;
import com.kandarp.salon.shared.salon.dto.SalonResponseDto;
import com.kandarp.salon.shared.user.dto.UserCreationDto;
import com.kandarp.salon.shared.user.dto.UserDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SalonServiceImpl implements SalonService {

	private final SalonRepository salonRepository;
	private final UserServiceClient userServiceClient;
	private final SalonMapper salonMapper;

	@Value("${salon.image.upload.dir}")
	private String uploadDir;

	@Value("${salon.image.url-prefix}")
	private String imageUrlPrefix;

	@Override
	@Transactional
	public SalonResponseDto createSalon(SalonCreationDto salonCreationDto, MultipartFile[] images) {
		// Create salon owner user
		UserCreationDto userCreationDto = salonCreationDto.getUser();
		ResponseEntity<String> userResponse = userServiceClient.createSalonOwnerUser(userCreationDto);
		String userId = userResponse.getBody();

		// Upload images
		List<String> salonImages = uploadSalonImages(images);

		// Create salon
		Salon salon = salonMapper.toEntity(salonCreationDto);
		salon.setOwnerId(userId);
		salon.setSalonImages(salonImages);
		Salon saved = salonRepository.save(salon);

		UserDto userDto = new UserDto(userId, userCreationDto.getFirstName(), userCreationDto.getLastName(),
				userCreationDto.getUserName(), userCreationDto.getEmail(), userCreationDto.getGender());
		
		
		SalonResponseDto responseDto = salonMapper.toDto(saved, imageUrlPrefix);
		
		responseDto.setUser(userDto);
		return responseDto;
	}

	@Override
	@Transactional
	public SalonResponseDto updateSalon(Long id, String userId, SalonRequestDto dto, MultipartFile[] images) {
		Salon salon = salonRepository.findById(id).orElseThrow();

		if (!salon.getOwnerId().equals(userId)) {
			throw new AccessDeniedException("You are not authorized to update this salon");
		}

		// Update salon details
		salonMapper.updateEntityFromDto(dto, salon);

		// Update images if provided
		if (images != null && images.length > 0) {
			// Delete existing images
			salon.getSalonImages().forEach(this::removeImage);
			// Upload new images
			List<String> newImages = uploadSalonImages(images);
			salon.setSalonImages(newImages);
		}

		Salon updated = salonRepository.save(salon);

		// Fetch user details for response
		ResponseEntity<UserDto> userDtoResponse = userServiceClient.getUserByUserId(salon.getOwnerId());

		SalonResponseDto responseDto = salonMapper.toDto(updated, imageUrlPrefix);
		responseDto.setUser(userDtoResponse.getBody());
		return responseDto;
	}

	@Override
	public SalonResponseDto getSalonById(Long id) {
		Salon salon = salonRepository.findById(id).orElseThrow();
		ResponseEntity<UserDto> userDtoResponse = userServiceClient.getUserByUserId(salon.getOwnerId());
		SalonResponseDto responseDto = salonMapper.toDto(salon, imageUrlPrefix);
		responseDto.setUser(userDtoResponse.getBody());
		return responseDto;
	}

	@Override
	public List<SalonResponseDto> getAllSalons() {
		List<Salon> salons = salonRepository.findAll();
		return salons.stream().map(salon -> {
			ResponseEntity<UserDto> userDtoResponse = userServiceClient.getUserByUserId(salon.getOwnerId());
			SalonResponseDto dto = salonMapper.toDto(salon, imageUrlPrefix);
			dto.setUser(userDtoResponse.getBody());
			return dto;
		}).collect(Collectors.toList());
	}

	@Override
	public SalonResponseDto getSalonByOwnerId(String ownerId) {
		Salon salon = salonRepository.findByOwnerId(ownerId).orElseThrow();
		ResponseEntity<UserDto> userDtoResponse = userServiceClient.getUserByUserId(salon.getOwnerId());
		SalonResponseDto responseDto = salonMapper.toDto(salon, imageUrlPrefix);
		responseDto.setUser(userDtoResponse.getBody());
		return responseDto;
	}

	@Override
	public void deleteSalon(Long id, String userId) {
		Salon salon = salonRepository.findById(id).orElseThrow();

		if (!salon.getOwnerId().equals(userId)) {
			throw new AccessDeniedException("You are not authorized to delete this salon");
		}

		// Delete images
		salon.getSalonImages().forEach(this::removeImage);

		salonRepository.delete(salon);
	}

	@Override
	public ResponseEntity<Resource> getImage(String filename) {
		try {
			Path filePath = resolveUploadPath().resolve(filename).normalize();
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

	@Override
	public Path resolveUploadPath() {
		return Paths.get(uploadDir).toAbsolutePath().normalize();
	}

	private List<String> uploadSalonImages(MultipartFile[] images) {
		if (images == null || images.length == 0) {
			return new ArrayList<>();
		}
		return Arrays.stream(images).filter(file -> !file.isEmpty() && file.getContentType().startsWith("image/"))
				.map(file -> {
					String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
					try {
						Path uploadPath = resolveUploadPath();
						if (!Files.exists(uploadPath)) {
							Files.createDirectories(uploadPath);
						}
						Path filePath = uploadPath.resolve(fileName);
						Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
						return fileName;
					} catch (IOException e) {
						throw new RuntimeException("Failed to save image: " + fileName, e);
					}
				}).collect(Collectors.toList());
	}

	private void removeImage(String fileName) {
		if (fileName == null || fileName.isBlank()) {
			return;
		}
		try {
			Path filePath = resolveUploadPath().resolve(fileName);
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