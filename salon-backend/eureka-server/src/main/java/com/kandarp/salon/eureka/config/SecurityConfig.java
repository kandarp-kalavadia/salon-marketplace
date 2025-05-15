package com.kandarp.salon.eureka.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.User.UserBuilder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
	
	@Value("${eureka.user.name}")
	private String userName;
	
	@Value("${eureka.user.password}")
	private String password;

	@Bean
	SecurityFilterChain webSecurityFilterChain(HttpSecurity http) throws Exception {
		http.csrf(customizer -> customizer.disable());
		http.authorizeHttpRequests(customizer -> { 
			customizer.requestMatchers("/actuator/**").permitAll();
			customizer.anyRequest().authenticated();
		});
		http.httpBasic(Customizer.withDefaults());
		return http.build();
	}


	@Bean
	UserDetailsService userDetailsService() {
		UserBuilder userBuilder = User.withUsername(userName)
				.password("{bcrypt}"+password);
		return new InMemoryUserDetailsManager(userBuilder.build());
	}
}
