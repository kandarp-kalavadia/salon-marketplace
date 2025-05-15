package com.kandarp.salon.shared.dto;

import java.time.LocalDateTime;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ErrorResponseDto {
	
	private int code;
	private String message;
	private LocalDateTime timestamp;
	private Map<String, String> details; // For validation errors
}