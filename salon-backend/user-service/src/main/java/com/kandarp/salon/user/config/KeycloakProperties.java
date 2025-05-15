package com.kandarp.salon.user.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Getter;
import lombok.Setter;


@ConfigurationProperties(prefix = "keycloak")
@Getter
@Setter
public class KeycloakProperties {

    private String serverUrl;
    private String realm;
    private String clientId;
    private Credentials credentials;

    // Getters and Setters
    public String getServerUrl() {
        return serverUrl;
    }

    public void setServerUrl(String serverUrl) {
        this.serverUrl = serverUrl;
    }

    public String getRealm() {
        return realm;
    }

    public void setRealm(String realm) {
        this.realm = realm;
    }

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public Credentials getCredentials() {
        return credentials;
    }

    public void setCredentials(Credentials credentials) {
        this.credentials = credentials;
    }

    @Getter
    @Setter
    public static class Credentials {
        private String secret;
    }
}