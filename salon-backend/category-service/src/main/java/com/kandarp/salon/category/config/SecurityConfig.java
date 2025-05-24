package com.kandarp.salon.category.config;

import org.springframework.boot.actuate.autoconfigure.security.servlet.EndpointRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

import com.kandarp.salon.category.exception.handler.CustomAccessDeniedHandler;
import com.kandarp.salon.category.exception.handler.CustomAuthenticationEntryPoint;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

	private final CustomAuthenticationEntryPoint authenticationEntryPoint;
	private final CustomAccessDeniedHandler accessDeniedHandler;

	@Bean
	SecurityFilterChain apiSecurityFilterChain(HttpSecurity http) throws Exception {

		http.authorizeHttpRequests(customizer -> {
			customizer.requestMatchers("/category-service-doc/**","/api/v1/categories/images/**").permitAll();
			
			customizer.requestMatchers(HttpMethod.GET,"/api/v1/categories/**").permitAll();

			
			customizer.requestMatchers(EndpointRequest.toAnyEndpoint()).permitAll();
			customizer.anyRequest().authenticated();
		});

		http.sessionManagement((sessionManagerConfigurer) -> {
			sessionManagerConfigurer.sessionCreationPolicy(SessionCreationPolicy.STATELESS);
		});

		http.csrf((csrfConfigurer) -> {
			csrfConfigurer.disable();
		});

		// When JWT token is provided but not valid then below authentication entry
		// point is executed
		http.oauth2ResourceServer(customizer -> customizer.jwt(c -> {
			c.jwtAuthenticationConverter(jwtAuthenticationConverter());
		}).authenticationEntryPoint(authenticationEntryPoint));

		// When JWT token not provided means no authentication detail provided at that
		// time if required
		// below authentication entry point is executed
		http.exceptionHandling(customizer -> {
			customizer.authenticationEntryPoint(authenticationEntryPoint);
			customizer.accessDeniedHandler(accessDeniedHandler);
		});

		return http.build();
	}

	private JwtAuthenticationConverter jwtAuthenticationConverter() {

		JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
		grantedAuthoritiesConverter.setAuthoritiesClaimName("roles"); // Use the roles claim
		grantedAuthoritiesConverter.setAuthorityPrefix("ROLE_"); // Prefix with ROLE_

		JwtAuthenticationConverter authenticationConverter = new JwtAuthenticationConverter();
		authenticationConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);

		return authenticationConverter;
	}
	
}