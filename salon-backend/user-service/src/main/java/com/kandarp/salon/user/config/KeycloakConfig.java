package com.kandarp.salon.user.config;

import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(KeycloakProperties.class)
public class KeycloakConfig {

	@Bean
	Keycloak keycloak(KeycloakProperties keycloakProperties) {
		return KeycloakBuilder.builder().serverUrl(keycloakProperties.getServerUrl())
				.realm(keycloakProperties.getRealm()).grantType(OAuth2Constants.CLIENT_CREDENTIALS)
				.clientId(keycloakProperties.getClientId())
				.clientSecret(keycloakProperties.getCredentials().getSecret())
				.build();
	}
}