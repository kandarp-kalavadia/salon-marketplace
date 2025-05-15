package com.kandarp.salon.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kandarp.salon.entity.Salon;

public interface SalonRepository extends JpaRepository<Salon, Long> {
	
	Optional<Salon> findByOwnerId(String ownerId);

}
