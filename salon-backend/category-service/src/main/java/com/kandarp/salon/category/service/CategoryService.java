package com.kandarp.salon.category.service;

import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import com.kandarp.salon.shared.category.dto.CategoryRequestDto;
import com.kandarp.salon.shared.category.dto.CategoryResponseDto;

public interface CategoryService {

	CategoryResponseDto createCategory(String ownerUserId, CategoryRequestDto dto, MultipartFile image);
    CategoryResponseDto getCategoryById(Long id);
    List<CategoryResponseDto> getAllCategories();
    List<CategoryResponseDto> getCategoriesBySalonId(Long salonId);
    CategoryResponseDto updateCategory(Long id, String ownerUserId, CategoryRequestDto dto, MultipartFile image);
    void deleteCategory(Long id, String ownerUserId);
    ResponseEntity<Resource> getImage(String filename);


}
