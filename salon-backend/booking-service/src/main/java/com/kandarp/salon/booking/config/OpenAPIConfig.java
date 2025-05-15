package com.kandarp.salon.booking.config;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;

@SecurityScheme(name = "Keycloak", openIdConnectUrl = "${openid.connect.url}", scheme = "bearer", type = SecuritySchemeType.OPENIDCONNECT, in = SecuritySchemeIn.HEADER)
public class OpenAPIConfig {

}
