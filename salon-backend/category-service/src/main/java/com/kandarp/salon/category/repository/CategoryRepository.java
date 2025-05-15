package com.kandarp.salon.category.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kandarp.salon.category.entity.Category;

public interface CategoryRepository  extends JpaRepository<Category, Long> {
	
    List<Category> findBySalonId(Long id);
}