package com.kandarp.salon.user.service;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.RoleScopeResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.kandarp.salon.shared.user.dto.UserDto;
import com.kandarp.salon.user.config.KeycloakProperties;
import com.kandarp.salon.user.mapper.UserMapper;

import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.ForbiddenException;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.ServerErrorException;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

	private final Keycloak keycloak;
	private final KeycloakProperties keycloakProperties;

	public String createUser(String firstName, String lastName, String username, String password, String email,
			String role, String gender) {
		String userId = null;
		try {

			UserRepresentation user = buildUserRepresentation(firstName, lastName, username, email, password, gender);
			RealmResource realmResource = keycloak.realm(keycloakProperties.getRealm());
			UsersResource usersResource = realmResource.users();

			Response response = usersResource.create(user);
			int status = response.getStatus();
			handleUserCreationResponse(status);

			userId = extractUserId(response);
			try {
				assignRoleToUser(realmResource, username, role, userId);
				log.info("Successfully created user: {}", username);
			} catch (WebApplicationException e) {
				log.warn("Role assignment failed for user: {}. Reverting user creation.", username);
				usersResource.get(userId).remove();
				userId = null;
				log.info("User {} deleted due to role assignment failure.", username);
				throw e;
			}
		} catch (Exception e) {
			throw e;
		}

		return userId;
	}

	public UserDto getUserById(String userId) {
		try {
			RealmResource realmResource = keycloak.realm(keycloakProperties.getRealm());
			UsersResource usersResource = realmResource.users();
			UserRepresentation userRepresentation = usersResource.get(userId).toRepresentation();
			log.info("User fetched Successfully.");

			return UserMapper.MAPPER.userRepresentationToUserDto(userRepresentation);
		} catch (NotFoundException e) {
			throw new NotFoundException("User Not Found: ", e);
		} catch (Exception e) {
			throw new ServerErrorException("Unexpected error during fetching user: ",
					HttpStatus.INTERNAL_SERVER_ERROR.value());
		}
	}

	private UserRepresentation buildUserRepresentation(String firstName, String lastName, String username, String email,
			String password, String gender) {
		UserRepresentation user = new UserRepresentation();
		user.setUsername(username);
		user.setFirstName(firstName);
		user.setLastName(lastName);
		user.setEmail(email);
		user.setEnabled(true);
		user.setEmailVerified(true);

		Map<String, List<String>> attributes = Map.of("gender", List.of(gender));
		user.setAttributes(attributes);

		CredentialRepresentation credential = new CredentialRepresentation();
		credential.setType(CredentialRepresentation.PASSWORD);
		credential.setValue(password);
		credential.setTemporary(false);
		user.setCredentials(Collections.singletonList(credential));

		return user;
	}

	private String extractUserId(Response response) {
		return response.getLocation().getPath().replaceAll(".*/", "");
	}

	private void assignRoleToUser(RealmResource realmResource, String username, String role, String userId) {
		try {
			RoleRepresentation roleRepresentation = realmResource.roles().get(role).toRepresentation();
			RoleScopeResource roleScopeResource = realmResource.users().get(userId).roles().realmLevel();
			roleScopeResource.add(Collections.singletonList(roleRepresentation));
		} catch (ForbiddenException e) {
			throw new ForbiddenException("Permission denied to retrieve or assign role: " + role, e);
		} catch (NotFoundException e) {
			throw new NotFoundException("Role not found: " + role, e);
		} catch (BadRequestException e) {
			throw new BadRequestException("Bad Request during role assignment" + role, e);
		} catch (Exception e) {
			throw new ServerErrorException("Unexpected error during role assignment for user: " + username,
					HttpStatus.INTERNAL_SERVER_ERROR.value());
		}
	}

	private void handleUserCreationResponse(int statusCode) {
		switch (statusCode) {
		case 201 -> {
			// User created successfully
		}
		case 400 -> throw new BadRequestException("Bad Request during user creation");
		case 403 -> throw new ForbiddenException("Permission denied to create user");
		case 409 -> throw new BadRequestException("User already exists");
		case 500 -> throw new ServerErrorException("Internal Server Error during user creation", statusCode);
		default -> throw new ServerErrorException("Unexpected response status during user creation: " + statusCode,
				statusCode);
		}
	}
}
