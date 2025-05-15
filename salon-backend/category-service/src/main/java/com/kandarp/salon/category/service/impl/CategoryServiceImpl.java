package com.kandarp.salon.category.service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
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
import org.springframework.web.multipart.MultipartFile;

import com.kandarp.salon.category.entity.Category;
import com.kandarp.salon.category.mapper.CategoryMapper;
import com.kandarp.salon.category.repository.CategoryRepository;
import com.kandarp.salon.category.service.CategoryService;
import com.kandarp.salon.category.service.client.SalonServiceClient;
import com.kandarp.salon.shared.category.dto.CategoryRequestDto;
import com.kandarp.salon.shared.category.dto.CategoryResponseDto;
import com.kandarp.salon.shared.salon.dto.SalonResponseDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

	private final SalonServiceClient salonServiceClient;
	private final CategoryRepository categoryRepository;
	private final CategoryMapper mapper;

	@Value("${salon.category.image.upload-dir}")
	private String uploadDir;

	@Value("${salon.category.image.url-prefix}")
	private String imageUrlPrefix;

	@Override
	public CategoryResponseDto createCategory(String ownerUserId, CategoryRequestDto dto, MultipartFile image) {
		ResponseEntity<SalonResponseDto> salonDtoResponse = salonServiceClient.getSalonByOwnerId(ownerUserId);

		String imagePath = null;
		if (image != null) {
			imagePath = uploadImage(image);
		}

		Category category = mapper.toEntity(dto);
		category.setSalonId(salonDtoResponse.getBody().getSalonId());
		category.setImage(imagePath);

		Category saved = categoryRepository.save(category);
		return mapper.toDto(saved, imageUrlPrefix);
	}

	@Override
	public CategoryResponseDto updateCategory(Long id, String ownerUserId, CategoryRequestDto dto,
			MultipartFile image) {

		Category entity = categoryRepository.findById(id).orElseThrow();

		ResponseEntity<SalonResponseDto> salonDtoResponse = salonServiceClient.getSalonById(entity.getSalonId());

		String salonOwnerUserId = salonDtoResponse.getBody().getUser().getUserId();
		if (!salonOwnerUserId.equals(ownerUserId)) {
			throw new AccessDeniedException("You are not authorized to update this category");
		}

		mapper.updateEntityFromDto(dto, entity);

		if (image != null) {
			if (entity.getImage() != null) {
				removeImage(entity.getImage());
			}
			String newImagePath = uploadImage(image);
			entity.setImage(newImagePath);
		}

		Category updated = categoryRepository.save(entity);
		return mapper.toDto(updated, imageUrlPrefix);
	}

	@Override
	public CategoryResponseDto getCategoryById(Long id) {
		Category entity = categoryRepository.findById(id).orElseThrow();
		return mapper.toDto(entity, imageUrlPrefix);
	}

	@Override
	public List<CategoryResponseDto> getAllCategories() {
		return categoryRepository.findAll().stream().map(entity -> mapper.toDto(entity, imageUrlPrefix))
				.collect(Collectors.toList());
	}

	@Override
	public List<CategoryResponseDto> getCategoriesBySalonId(Long salonId) {
		return categoryRepository.findBySalonId(salonId).stream().map(entity -> mapper.toDto(entity, imageUrlPrefix))
				.collect(Collectors.toList());
	}

	@Override
	public void deleteCategory(Long id, String ownerUserId) {
		Category entity = categoryRepository.findById(id).orElseThrow();

		ResponseEntity<SalonResponseDto> salonDtoResponse = salonServiceClient.getSalonById(entity.getSalonId());
		
		String salonOwnerUserId = salonDtoResponse.getBody().getUser().getUserId();
		if (!salonOwnerUserId.equals(ownerUserId)) {
			throw new RuntimeException("You are not authorized to delete this category");
		}

		if (entity.getImage() != null) {
			removeImage(entity.getImage());
		}

		categoryRepository.delete(entity);
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
