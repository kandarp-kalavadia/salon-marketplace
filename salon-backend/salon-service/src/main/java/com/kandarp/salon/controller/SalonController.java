package com.kandarp.salon.controller;

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

import com.kandarp.salon.service.SalonService;
import com.kandarp.salon.shared.salon.dto.SalonCreationDto;
import com.kandarp.salon.shared.salon.dto.SalonRequestDto;
import com.kandarp.salon.shared.salon.dto.SalonResponseDto;

import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Encoding;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/salons")
@RequiredArgsConstructor
@SecurityRequirement(name = "Keycloak")
public class SalonController {

	private final SalonService salonService;

	@PostMapping(path = "/signup", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@io.swagger.v3.oas.annotations.parameters.RequestBody(content = {
			@Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE, encoding = {
					@Encoding(name = "salon", contentType = "application/json"),
					@Encoding(name = "images", contentType = "image/jpeg") }) })
	public ResponseEntity<SalonResponseDto> createSalon(@Valid @RequestPart("salon") SalonCreationDto salonCreationDto,
			@RequestPart(value = "images", required = false) MultipartFile[] images) {
		SalonResponseDto responseDto = salonService.createSalon(salonCreationDto, images);
		return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
	}
	
	@PutMapping(value = "/{salonId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@io.swagger.v3.oas.annotations.parameters.RequestBody(content = {
			@Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE, encoding = {
					@Encoding(name = "salon", contentType = "application/json"),
					@Encoding(name = "images", contentType = "image/jpeg") }) })
	public ResponseEntity<SalonResponseDto> updateSalon(@PathVariable Long salonId,
			@Valid @RequestPart("salon") SalonRequestDto requestDto,
			@RequestPart(value = "images", required = false) MultipartFile[] images, @AuthenticationPrincipal Jwt jwt) {
		SalonResponseDto responseDto = salonService.updateSalon(salonId, jwt.getSubject(), requestDto, images);
		return ResponseEntity.ok(responseDto);
	}

	@GetMapping("/{salonId}")
	public ResponseEntity<SalonResponseDto> getSalonById(@PathVariable Long salonId) {
		SalonResponseDto responseDto = salonService.getSalonById(salonId);
		return ResponseEntity.ok(responseDto);
	}
	

	@GetMapping("/owner/{ownerId}")
	public ResponseEntity<SalonResponseDto> getSalonByOwnerId(@PathVariable String ownerId) {
		SalonResponseDto responseDto = salonService.getSalonByOwnerId(ownerId);
		return ResponseEntity.ok(responseDto);
	}

	@GetMapping
	public ResponseEntity<List<SalonResponseDto>> getAllSalons() {
		List<SalonResponseDto> responseDtos = salonService.getAllSalons();
		return ResponseEntity.ok(responseDtos);
	}



	@DeleteMapping("/{salonId}")
	public ResponseEntity<Void> deleteSalon(@PathVariable Long salonId, @AuthenticationPrincipal Jwt jwt) {
		salonService.deleteSalon(salonId, jwt.getSubject());
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/images/{filename:.+}")
	public ResponseEntity<Resource> getImage(@PathVariable String filename) {
		return salonService.getImage(filename);
	}
}