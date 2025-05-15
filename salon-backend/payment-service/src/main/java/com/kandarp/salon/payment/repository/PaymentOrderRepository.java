package com.kandarp.salon.payment.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kandarp.salon.payment.entity.PaymentOrder;


public interface PaymentOrderRepository extends JpaRepository<PaymentOrder, Long> {
	
	Optional<PaymentOrder> findBySessionId(String sessionId);
}