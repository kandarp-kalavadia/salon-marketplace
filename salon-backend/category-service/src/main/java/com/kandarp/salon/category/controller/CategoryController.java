package com.kandarp.salon.category.controller;

import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.kandarp.salon.category.service.CategoryService;
import com.kandarp.salon.shared.category.dto.CategoryRequestDto;
import com.kandarp.salon.shared.category.dto.CategoryResponseDto;

import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Encoding;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
@SecurityRequirement(name = "Keycloak")
public class CategoryController {

	private final CategoryService categoryService;

	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@io.swagger.v3.oas.annotations.parameters.RequestBody(content = {
			@Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE, encoding = {
					@Encoding(name = "category", contentType = "application/json"),
					@Encoding(name = "image", contentType = "image/jpeg") }) })
	public ResponseEntity<CategoryResponseDto> createCategory(@RequestPart("category") CategoryRequestDto requestDto,
			@RequestPart(value = "image", required = false) MultipartFile image, @AuthenticationPrincipal Jwt jwt) {
		CategoryResponseDto responseDto = categoryService.createCategory(jwt.getSubject(), requestDto, image);
		return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
	}

	@PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@io.swagger.v3.oas.annotations.parameters.RequestBody(content = {
			@Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE, encoding = {
					@Encoding(name = "category", contentType = "application/json"),
					@Encoding(name = "image", contentType = "image/jpeg") }) })
	public ResponseEntity<CategoryResponseDto> updateCategory(@PathVariable Long id,
			@RequestPart("category") CategoryRequestDto requestDto,
			@RequestPart(value = "image", required = false) MultipartFile image, @AuthenticationPrincipal Jwt jwt) {
		CategoryResponseDto responseDto = categoryService.updateCategory(id, jwt.getSubject(), requestDto, image);
		return ResponseEntity.ok(responseDto);
	}

	@GetMapping("/{id}")
	public ResponseEntity<CategoryResponseDto> getCategoryById(@PathVariable Long id) {
		CategoryResponseDto responseDto = categoryService.getCategoryById(id);
		return ResponseEntity.ok(responseDto);
	}

	@GetMapping
	public ResponseEntity<List<CategoryResponseDto>> getAllCategories() {
		List<CategoryResponseDto> responseDtos = categoryService.getAllCategories();
		return ResponseEntity.ok(responseDtos);
	}

	@GetMapping("/salon/{salonId}")
	public ResponseEntity<List<CategoryResponseDto>> getCategoriesBySalonId(@PathVariable Long salonId) {
		List<CategoryResponseDto> responseDtos = categoryService.getCategoriesBySalonId(salonId);
		return ResponseEntity.ok(responseDtos);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteCategory(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
		categoryService.deleteCategory(id, jwt.getSubject());
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/images/{filename:.+}")
	public ResponseEntity<Resource> getCategoryImage(@PathVariable String filename) {
		return categoryService.getImage(filename);
	}

}
