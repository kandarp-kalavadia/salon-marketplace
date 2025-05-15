package com.kandarp.salon.shared.user.dto;

import com.kandarp.salon.shared.user.constant.Gender;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserCreationDto {

    @NotBlank(message = "First name is required.")
    @Size(min = 2, max = 50, message = "First name must be 2 to 50 characters long.")
    @Pattern(regexp = "^[a-zA-Z\\s-']+$", message = "First name can only include letters, spaces, hyphens, or apostrophes.")
    private String firstName;

    @NotBlank(message = "Last name is required.")
    @Size(min = 2, max = 50, message = "Last name must be 2 to 50 characters long.")
    @Pattern(regexp = "^[a-zA-Z\\s-']+$", message = "Last name can only include letters, spaces, hyphens, or apostrophes.")
    private String lastName;

    @NotBlank(message = "Username is required.")
    @Size(min = 4, max = 30, message = "Username must be 4 to 30 characters long.")
    @Pattern(regexp = "^[a-zA-Z0-9_-]+$", message = "Username can only include letters, numbers, underscores, or hyphens.")
    private String userName;

    @NotBlank(message = "Email is required.")
    @Email(message = "Email must be a valid email address.")
    @Size(max = 255, message = "Email must not exceed 255 characters.")
    private String email;

    @NotBlank(message = "Password is required.")
    @Size(min = 8, max = 128, message = "Password must be 8 to 128 characters long.")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$",
        message = "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).")
    private String password;

    @NotNull(message = "Gender is required.")
    private Gender gender;
    

}