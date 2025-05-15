package com.kandarp.salon.serviceoffering;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class ServiceofferingServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServiceofferingServiceApplication.class, args);
	}

}
