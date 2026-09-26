package com.pasara.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RegisterRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String email;

    @NotBlank
    @Size(min = 6)
    private String password;
}
