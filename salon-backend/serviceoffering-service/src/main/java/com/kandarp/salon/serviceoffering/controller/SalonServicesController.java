package com.kandarp.salon.serviceoffering.controller;

import java.util.List;
import java.util.Set;

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

import com.kandarp.salon.serviceoffering.service.ServiceOfferingService;
import com.kandarp.salon.shared.serviceoffering.dto.ServiceOfferingRequestDto;
import com.kandarp.salon.shared.serviceoffering.dto.ServiceOfferingResponseDto;

import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Encoding;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/salonservices")
@RequiredArgsConstructor
@SecurityRequirement(name = "Keycloak")
public class SalonServicesController {


    private final ServiceOfferingService serviceOfferingService;


    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @io.swagger.v3.oas.annotations.parameters.RequestBody(content = {
			@Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE, encoding = {
					@Encoding(name = "serviceOffering", contentType = "application/json"),
					@Encoding(name = "image", contentType = "image/jpeg") }) })
    public ResponseEntity<ServiceOfferingResponseDto> createServiceOffering(
            @RequestPart("serviceOffering") ServiceOfferingRequestDto requestDto,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal Jwt jwt) {
        ServiceOfferingResponseDto responseDto = serviceOfferingService.createServiceOffering(jwt.getSubject(), requestDto, image);
        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }
    
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @io.swagger.v3.oas.annotations.parameters.RequestBody(content = {
			@Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE, encoding = {
					@Encoding(name = "serviceOffering", contentType = "application/json"),
					@Encoding(name = "image", contentType = "image/jpeg") }) })
    public ResponseEntity<ServiceOfferingResponseDto> updateServiceOffering(
            @PathVariable Long id,
            @RequestPart("serviceOffering") ServiceOfferingRequestDto requestDto,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal Jwt jwt) {
        ServiceOfferingResponseDto responseDto = serviceOfferingService.updateServiceOffering(id, jwt.getSubject(), requestDto, image);
        return ResponseEntity.ok(responseDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceOfferingResponseDto> getServiceOfferingById(@PathVariable Long id) {
        ServiceOfferingResponseDto responseDto = serviceOfferingService.getServiceOfferingById(id);
        return ResponseEntity.ok(responseDto);
    }
    
    @GetMapping("/list/{ids}")
    public ResponseEntity<List<ServiceOfferingResponseDto>> getServiceOfferingByIds(@PathVariable Set<Long> ids) {
    	List<ServiceOfferingResponseDto> responseDtos = serviceOfferingService.getServiceOfferingByIds(ids);
        return ResponseEntity.ok(responseDtos);
    }

    @GetMapping
    public ResponseEntity<List<ServiceOfferingResponseDto>> getAllServiceOfferings() {
        List<ServiceOfferingResponseDto> responseDtos = serviceOfferingService.getAllServiceOfferings();
        return ResponseEntity.ok(responseDtos);
    }

    @GetMapping("/salon/{salonId}")
    public ResponseEntity<List<ServiceOfferingResponseDto>> getServiceOfferingsBySalonId(@PathVariable Long salonId) {
        List<ServiceOfferingResponseDto> responseDtos = serviceOfferingService.getServiceOfferingsBySalonId(salonId);
        return ResponseEntity.ok(responseDtos);
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ServiceOfferingResponseDto>> getServiceOfferingsByCategoryId(@PathVariable Long categoryId) {
        List<ServiceOfferingResponseDto> responseDtos = serviceOfferingService.getServiceOfferingsByCategoryId(categoryId);
        return ResponseEntity.ok(responseDtos);
    }

  

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteServiceOffering(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        serviceOfferingService.deleteServiceOffering(id, jwt.getSubject());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/images/{filename:.+}")
    public ResponseEntity<Resource> getServiceOfferingImage(@PathVariable String filename) {
        return serviceOfferingService.getImage(filename);
    }

	
}
