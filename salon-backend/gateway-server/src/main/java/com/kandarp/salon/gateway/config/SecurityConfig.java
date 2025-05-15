package com.kandarp.salon.gateway.config;

import org.springframework.boot.actuate.autoconfigure.security.reactive.EndpointRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtGrantedAuthoritiesConverterAdapter;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.context.NoOpServerSecurityContextRepository;

import com.kandarp.salon.gateway.exception.CustomAccessDeniedHandler;
import com.kandarp.salon.gateway.exception.CustomAuthenticationEntryPoint;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

	private final CustomAuthenticationEntryPoint authenticationEntryPoint;
	private final CustomAccessDeniedHandler accessDeniedHandler;

	@Bean
	SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {

		http.csrf(customizer -> customizer.disable());

		http.authorizeExchange((customizer) -> {
			// Swagger UI related endpoints
			customizer.pathMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll();
			
			// Swagger API related endpoints
			customizer.pathMatchers("/user-service-doc/**", "/salon-service-doc/**", "/category-service-doc/**",
					"/serviceoffering-service-doc/**", "/review-service-doc/**", "/booking-service-doc/**",
					"/payment-service-doc/**", "/notification-service-doc/**").permitAll();
			
			// SignUp related endpoints
			customizer.pathMatchers("/api/v1/users/signup").permitAll();
			customizer.pathMatchers("/api/v1/users/salon/signup").permitAll();
			customizer.pathMatchers("/api/v1/salons/signup").permitAll();
			
			// Images related endpoints
			customizer.pathMatchers("/api/v1/salons/images/**").permitAll();
			customizer.pathMatchers("/api/v1/categories/images/**").permitAll();
			customizer.pathMatchers("/api/v1/salonservices/images/**").permitAll();
			
			// Payment webhook
			customizer.pathMatchers("/api/v1/payments/webhook/**").permitAll();

			
			//Actuator related endpoints
			customizer.matchers(EndpointRequest.toAnyEndpoint()).permitAll();
			
			customizer.anyExchange().authenticated();
		});

		http.oauth2ResourceServer(customizer -> customizer
				.jwt(jwtCustomizer -> jwtCustomizer.jwtAuthenticationConverter(jwtAuthenticationConverter()))
				.authenticationEntryPoint(authenticationEntryPoint));

		http.securityContextRepository(NoOpServerSecurityContextRepository.getInstance());

		http.exceptionHandling(customizer -> {
			customizer.authenticationEntryPoint(authenticationEntryPoint);
			customizer.accessDeniedHandler(accessDeniedHandler);
		});

		return http.build();

	}

	private ReactiveJwtAuthenticationConverter jwtAuthenticationConverter() {

		JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
		grantedAuthoritiesConverter.setAuthoritiesClaimName("roles"); // Use the roles claim
		grantedAuthoritiesConverter.setAuthorityPrefix("ROLE_"); // Prefix with ROLE_

		ReactiveJwtAuthenticationConverter authenticationConverter = new ReactiveJwtAuthenticationConverter();

		authenticationConverter.setJwtGrantedAuthoritiesConverter(
				new ReactiveJwtGrantedAuthoritiesConverterAdapter(grantedAuthoritiesConverter));

		return authenticationConverter;
	}

}
