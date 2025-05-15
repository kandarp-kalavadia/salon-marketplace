package com.kandarp.salon.shared.user.constant;

public enum Gender {
	
	MALE("Male"),FEMALE("Female");
	
	private String value;

	Gender(String value) {
		this.value = value;
	}

	public String getValue() {
		return value;
	}
	

}
