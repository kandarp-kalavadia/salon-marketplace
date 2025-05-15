package com.kandarp.salon.review.client.interceptor;
import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

@Component
public class JwtRequestInterceptor implements RequestInterceptor {

    @Override
    public void apply(RequestTemplate template) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null &&  authentication.getCredentials() != null && authentication.getCredentials() instanceof Jwt) {
        	Jwt credentials = (Jwt) authentication.getCredentials();
            template.header("Authorization", "Bearer " + credentials.getTokenValue());
        }
    }
}